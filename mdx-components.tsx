import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

import { CallOut } from '@codegouvfr/react-dsfr/CallOut';
import { Table } from '@codegouvfr/react-dsfr/Table';
import { fr } from '@codegouvfr/react-dsfr';

// customize how MDX components are rendered - use DSFR components when possible
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className={fr.cx('fr-h1')}>{children}</h1>,
    h2: ({ children }) => <h2 className={fr.cx('fr-mt-3w', 'fr-h2')}>{children}</h2>,
    h3: ({ children }) => <h3 className={fr.cx('fr-mt-3w', 'fr-h3')}>{children}</h3>,
    h4: ({ children }) => <h4 className={fr.cx('fr-mt-3w', 'fr-h4')}>{children}</h4>,
    // @ts-ignore
    table: (props) => {
      if (props.children && Array.isArray(props.children) && props.children.length === 2) {
        const [head, body] = props.children;
        const headers = head.props.children.props.children.map((child: any) => child.props.children);
        const data = body.props.children.map((row: any) => row.props.children.map((cell: any) => cell.props.children));
        return <Table headers={headers} data={data} />;
      }
      return <div></div>;
    },
    a: (props) => {
      if (props.href && (props.href?.startsWith('http') || props.href?.startsWith('//'))) {
        //@ts-ignore
        return <Link {...props} target="_blank" rel="noopener noreferrer" />;
      }
      //@ts-ignore
      return <Link {...props} />;
    },
    blockquote: (props) => {
      if (props.children && Array.isArray(props.children) && props.children.length === 3) {
        return <CallOut>{props.children[1].props.children}</CallOut>;
      }
      return <CallOut>{props.children}</CallOut>;
    },
    ...components
  };
}
