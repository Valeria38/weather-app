import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Card from './';

describe('Card Component', () => {
  it('renders title and children correctly', () => {
    render(
      <Card title="Test Card Title">
        <div>Child Content</div>
      </Card>,
    );

    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies custom className and childrenClassName', () => {
    const { container } = render(
      <Card
        className="custom-wrapper-class"
        childrenClassName="custom-grid-class"
        title="Card"
      >
        <div>Content</div>
      </Card>,
    );

    const cardWrapper = container.firstChild;
    expect(cardWrapper).toHaveClass('custom-wrapper-class');
    const childrenContainer = screen.getByText('Content').parentElement;
    expect(childrenContainer).toHaveClass('custom-grid-class');
  });
});
