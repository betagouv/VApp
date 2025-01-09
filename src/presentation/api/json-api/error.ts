import { ZodIssue, ZodIssueCode } from 'zod';
import { z } from '@/libs/validation';
import { uuid } from 'short-uuid';

export const zodIssuePathToJsonPointer = (path: ZodIssue['path']) => (!path.length ? '' : '/' + path.join('/'));

export interface JsonApiErrorInterface {
  status: string;
  id?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
    header?: string;
  };
}

export type SourceType = 'pointer' | 'parameter' | 'header';

export class JsonApiError implements JsonApiErrorInterface {
  constructor(
    public status: string,
    public id?: string,
    public code?: string,
    public title?: string,
    public detail?: string,
    public source?: {
      pointer?: string;
      parameter?: string;
      header?: string;
    }
  ) {}

  static fromZodIssue = (
    { code, path, message, ...issue }: ZodIssue,
    status = '400',
    sourceType: SourceType = 'pointer'
  ): JsonApiErrorInterface => {
    const jsonApiErrorSpecificFields: Partial<JsonApiErrorInterface> = {
      source: {}
    };
    switch (code) {
      case ZodIssueCode.invalid_type:
      case ZodIssueCode.invalid_literal:
        // @ts-expect-error todo more work on discrimination
        jsonApiErrorSpecificFields.detail = `Expected ${issue.expected} but received ${issue.received}`;
        break;
      default:
        break;
    }

    switch (sourceType) {
      case 'parameter':
        jsonApiErrorSpecificFields.source = {
          parameter: String(path[0])
        };
        break;
      case 'header':
        jsonApiErrorSpecificFields.source = {
          header: String(path[0])
        };
        break;

      case 'pointer':
      default:
        jsonApiErrorSpecificFields.source = {
          pointer: zodIssuePathToJsonPointer(path)
        };
        break;
    }

    return {
      status,
      id: uuid(),
      title: message,
      code: code,
      ...jsonApiErrorSpecificFields
      //   id: a unique identifier for this particular occurrence of the problem.
      //   code: an application-specific error code, expressed as a string value.
      //   title: a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
      //   detail: a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.
      //   source: an object containing references to the primary source of the error. It SHOULD include one of the following members or be omitted:
      //   pointer: a JSON Pointer [RFC6901] to the value in the request document that caused the error [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute]. This MUST point to a value in the request document that exists; if it doesn’t, the client SHOULD simply ignore the pointer.
      //   parameter: a string indicating which URI query parameter caused the error.
      //   header: a string indicating the name of a single request header which caused the error.
      //   meta: a meta object containing non-standard meta-information about the error.
    };
  };
}

export const JsonApiErrorSchema = z.object({
  status: z.string(),
  id: z.string().optional(),
  code: z.string().optional(),
  title: z.string().optional(),
  detail: z.string().optional(),
  source: z
    .object({
      pointer: z.string().optional(),
      parameter: z.string().optional(),
      header: z.string().optional()
    })
    .optional()
});

JsonApiErrorSchema._output satisfies JsonApiErrorInterface;
