# This script is meant to help generate a database scored based on human input

from decouple import Config, RepositoryEnv
from ollama_interaction import generate_ollama_embeddings

import pandas as pd
import ast
import json
import time
import numpy as np

config = Config(RepositoryEnv('.env'))

ollama_api_url = config('OLLAMA_API_URL')
ollama_bearer_token = config('OLLAMA_BEARER_TOKEN')

gpu_model = config('OLLAMA_GPU')

def str_to_float_list(value):
    try:
        return [float(x) for x in ast.literal_eval(value)]
    except (ValueError, SyntaxError):
        return []

def cosine_similarity_multi(user_prompt_emb:list, aides_description_list_mb_emb:list[list]):
    dot_products = np.dot(aides_description_list_mb_emb, user_prompt_emb)
    norm_user_prompt_emb = np.linalg.norm(user_prompt_emb)
    norms_list_mb_emb = np.linalg.norm(aides_description_list_mb_emb, axis=1)

    return dot_products / (norm_user_prompt_emb * norms_list_mb_emb)

# Load un échantillion de description de projet
with open("../data/project-description-sample.json",'r') as file:
    project_descrpition_list = json.load(file)

data = pd.read_csv("hard-database/data_at_select_ai_emb.csv",index_col='id', converters={"embedding_md": str_to_float_list})
data = data[(data['token_numb_description']<5000)&(data['token_numb_description']>500)]

project_descrpition_embedding = {}
for project_descrpition_key in project_descrpition_list:
    prompt = project_descrpition_list[project_descrpition_key]
    response = generate_ollama_embeddings(prompt=prompt,ollama_api_url=ollama_api_url)
    embedding = response['embedding']
    project_descrpition_embedding[project_descrpition_key] = embedding

def gen_human_score(max_score:int=100,min_score:int=0):
    user_answered = False
    while not user_answered:
        print('-------')
        try :
            score = int(input("enter a note between 0 and 100 that you think is a good note matching the project and the sub\n"))
            if score < min_score:
                print("please enter higher score")
            elif score > max_score:
                print("please enter lower score")
            else:
                score_sub = score
                user_answered = True
        except:
            print("note a proper note format")
    return score_sub

max_score = 100
min_score = 0

first_row_limit = 25
best_rag_row_limit = 25


row_list = []
for project_descrpition_key in project_descrpition_list:

    data_embedding_md_normalize = np.array(list(data['embedding_md'].values))
    score_emb = cosine_similarity_multi(project_descrpition_embedding[project_descrpition_key], data_embedding_md_normalize)
    data['score_embedding'] = score_emb

    project_description = project_descrpition_list[project_descrpition_key]
    print('------------------------------------')
    print('------------------------------------')
    print('---------------WARNING--------------')
    print('------------------------------------')
    print('------------------------------------')
    print('starting : ',project_description[:80])
    for i, row in data[:first_row_limit].iterrows():
        print('-------------------------')
        print("Project description :", project_description)
        print('-----')
        print('Aide name : ',row['name'])
        print('-----')
        print(f"https://aides-territoires.beta.gouv.fr{row['url']}")

        score_sub_list = []
        score_sub = 0
        seed = 0
        scoring_made = 0
        retry = 0

        start_requesting_score = time.time()

        score_sub = gen_human_score(max_score=max_score,min_score=min_score)

        end_requesting_score = time.time()
        row['project_description'] = project_description
        row['project_score'] = score_sub
        row['scoring_made'] = 1
        row['scoring_error'] = 0
        row['request_time_total'] = end_requesting_score - start_requesting_score
        row['request_time_single'] = (end_requesting_score - start_requesting_score)
        row['gpu'] = "human"
        row_list.append(row)

    for i, row in data.nlargest(best_rag_row_limit,"score_embedding").iterrows():
        print('-------------------------')
        print("Project description :", project_description)
        print('-----')
        print('Aide name : ',row['name'])
        print('-----')
        print(f"https://aides-territoires.beta.gouv.fr{row['url']}")

        score_sub_list = []
        score_sub = 0
        seed = 0
        scoring_made = 0
        retry = 0

        start_requesting_score = time.time()

        score_sub = gen_human_score(max_score=max_score,min_score=min_score)

        end_requesting_score = time.time()
        row['project_description'] = project_description
        row['project_score'] = score_sub
        row['scoring_made'] = 1
        row['scoring_error'] = 0
        row['request_time_total'] = end_requesting_score - start_requesting_score
        row['request_time_single'] = (end_requesting_score - start_requesting_score)
        row['gpu'] = "human"
        row_list.append(row)

def normalize_score(project_score:int,scoring_made:int,max_score:int=5,min_score:int=-5)->(float,float):
    corrected_project_score = project_score/scoring_made

    corrected_normalize_score =(corrected_project_score-min_score)/(max_score-min_score)

    return corrected_normalize_score, corrected_project_score

data_project_score = pd.DataFrame(row_list)

corrected_normalize_score, corrected_project_score = normalize_score(data_project_score['project_score'],data_project_score['scoring_made'],max_score=max_score,min_score=min_score)

data_project_score['corrected_normalize_score'] = corrected_normalize_score
data_project_score['corrected_project_score'] = corrected_project_score

data_project_score.to_csv(f"hard-database/data_project_scoring_gpu_human.csv")
