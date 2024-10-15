from decouple import Config, RepositoryEnv

config = Config(RepositoryEnv('.env'))