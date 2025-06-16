interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

export const BackgroundFiller = ({ ...props }: Props) => {
  return <img src="/assets/hexagon.svg" {...props} />;
};
