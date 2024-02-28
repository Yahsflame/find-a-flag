// DataTable.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CountryProvider } from '../contexts/CountryContext';
import DataTable from '../components/DataTable';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { name: { common: 'Country A' }, population: 800000, capital: ['Capital A'], flag: '🇦', flags: { png: 'https://flagcdn.com/a.png' } },
        { name: { common: 'Country B' }, population: 2000000, capital: ['Capital B'], flag: '🇧', flags: { png: 'https://flagcdn.com/b.png' } },
        { name: { common: 'Country C' }, population: 7000000, capital: ['Capital C'], flag: '🇨', flags: { png: 'https://flagcdn.com/c.png' } },
      ]),
    })
  );
});

afterAll(() => {
  if (global.fetch && jest.isMockFunction(global.fetch)) {
    global.fetch.mockClear();
  }
  delete global.fetch;
});

const renderWithProvider = (component) => {
  return render(<CountryProvider>{component}</CountryProvider>);
};

describe('DataTable', () => {
  it('renders correctly and filters countries based on population filter', async () => {
    renderWithProvider(<DataTable />);

    expect(await screen.findByText('Country A')).toBeInTheDocument();
    expect(screen.getByText('Country B')).toBeInTheDocument();
    expect(screen.getByText('Country C')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Population Filter:'), { target: { value: '1000000-5000000' } });

    expect(screen.queryByText('Country A')).not.toBeInTheDocument();
    expect(screen.queryByText('Country C')).not.toBeInTheDocument();
    expect(screen.getByText('Country B')).toBeInTheDocument();
  });
});

describe('DataTable Download Button', () => {
  it('renders download buttons with correct links', async () => {
    render(<CountryProvider><DataTable /></CountryProvider>);

    const downloadLinks = await screen.findAllByRole('link', {
      name: /download/i,
    });

    expect(downloadLinks[0]).toHaveAttribute('href', expect.stringContaining('https://flagcdn.com/a.png'));
    expect(downloadLinks.length).toBeGreaterThan(0);
  });
});