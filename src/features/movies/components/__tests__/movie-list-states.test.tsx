import { fireEvent, render, screen } from '@testing-library/react-native';

import { MovieListFooter, MovieListState } from '../movie-list-states';

describe('movie list states', () => {
  it('renders an actionable empty/error state', () => {
    const onActionPress = jest.fn();

    render(
      <MovieListState
        title="No movies found"
        copy="No titles matched the pasture rules."
        actionLabel="Try again"
        onActionPress={onActionPress}
      />,
    );

    expect(screen.getByText('No movies found')).toBeTruthy();
    expect(screen.getByText('No titles matched the pasture rules.')).toBeTruthy();

    fireEvent.press(screen.getByText('Try again'));

    expect(onActionPress).toHaveBeenCalledTimes(1);
  });

  it('renders no footer content when pagination is idle', () => {
    const { toJSON } = render(<MovieListFooter isLoading={false} />);

    expect(toJSON()).toBeNull();
  });
});
