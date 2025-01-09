import { generateOpenApi } from '@/presentation/api/open-api';

export async function generateStaticParams() {
  return [{ version: 'v1' }];
}

export async function GET(request: Request, { params }: { params: Promise<{ version: string }> }) {
  const version = (await params).version;

  return Response.json(generateOpenApi(version));
}
