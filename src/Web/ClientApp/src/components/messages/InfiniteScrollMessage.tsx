interface Props extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string
}