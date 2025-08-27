export interface Entrant {
  id: string;
  name: string;
  email: string;
  status: 'Entrant' | 'Finalist' | 'Eliminated' | 'Winner';
}

export const mockEntrants: Entrant[] = [
  // Entrants
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'Entrant' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', status: 'Entrant' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', status: 'Entrant' },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', status: 'Entrant' },
  { id: '5', name: 'Ethan Davis', email: 'ethan@example.com', status: 'Entrant' },
  { id: '6', name: 'Fiona Garcia', email: 'fiona@example.com', status: 'Entrant' },
  { id: '7', name: 'George Rodriguez', email: 'george@example.com', status: 'Entrant' },
  { id: '8', name: 'Hannah Martinez', email: 'hannah@example.com', status: 'Entrant' },
  { id: '9', name: 'Ian Hernandez', email: 'ian@example.com', status: 'Entrant' },
  { id: '10', name: 'Jane Lopez', email: 'jane@example.com', status: 'Entrant' },

  // Finalists
  { id: '11', name: 'Kevin Gonzalez', email: 'kevin@example.com', status: 'Finalist' },
  { id: '12', name: 'Laura Wilson', email: 'laura@example.com', status: 'Finalist' },
  { id: '13', name: 'Mason Anderson', email: 'mason@example.com', status: 'Finalist' },
  { id: '14', name: 'Nora Thomas', email: 'nora@example.com', status: 'Finalist' },
  { id: '15', name: 'Oscar Taylor', email: 'oscar@example.com', status: 'Finalist' },

  // Winner
  { id: '16', name: 'Penelope Moore', email: 'penelope@example.com', status: 'Winner' },
];