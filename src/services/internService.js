import { mockInterns } from '../mocks/data';

const internService = {
  getAll: () => Promise.resolve({ data: mockInterns }),
  getById: (id) => Promise.resolve({
    data: mockInterns.find((intern) => intern.id === id) || null,
  }),
  create: (internData) => {
    const nextId = mockInterns.length
      ? Math.max(...mockInterns.map((i) => i.id)) + 1
      : 1;
    const newIntern = { 
      ...internData, 
      id: nextId,
      status: internData.status || 'Pending'
    };
    mockInterns.push(newIntern);
    return Promise.resolve({ data: newIntern });
  },
  update: (id, internData) => {
    const index = mockInterns.findIndex((i) => i.id === id);
    if (index === -1) {
      return Promise.resolve({ data: null });
    }
    mockInterns[index] = { ...mockInterns[index], ...internData };
    return Promise.resolve({ data: mockInterns[index] });
  },
  remove: (id) => {
    const index = mockInterns.findIndex((i) => i.id === id);
    if (index === -1) {
      return Promise.resolve({ data: false });
    }
    mockInterns.splice(index, 1);
    return Promise.resolve({ data: true });
  },
};

export default internService;