import { cx, type CxArg } from '@codegouvfr/react-dsfr/tools/cx';
import { type PropsWithChildren } from 'react';

export type ContainerProps = PropsWithChildren<{
  className?: CxArg;
  fluid?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xl';
}>;

/**
 * TODO: modifier doc depuis la suppression des Box
 *
 * Un Container est un composant qui permet de centrer le contenu de la page et d'ajouter des gouttières.
 *
 * Si fluid, alors il prend 100% de la largeur du viewport.
 *
 * Si size = xs, sm, md => les gouttières font 16 px.
 * Si size = lg ou xl => les gouttières font 24 px.
 *
 * Si size = xl, la largeur maximum du contenu est de 1200 px.
 *
 * Rappel des breakpoints du DFSR:
 * - xs: jusqu'à 575 px
 * - sm: jusqu'à 767 px
 * - md: jusqu'à 991 px
 * - lg: jusqu'à 1247 px
 * - xl: à partir de 1248  px
 *
 */
export const Container = ({ children, className, fluid, size, ...rest }: ContainerProps) => {
  let containerClass = 'fr-container';
  if (size) containerClass += `-${size}`;
  if (fluid) containerClass += `--fluid`;
  return (
    <div className={cx(className, containerClass)} {...rest}>
      {children}
    </div>
  );
};
