export const stats = [
  { title: 'TOTAL OCCUPANCY', value: '142', total: '/200', progress: 71, color: 'blue' },
  { title: 'LIVE GUEST REQUESTS', value: '12', total: 'Pending', color: 'purple' },
];

export const lotTabs = ['Lot A (Main)', 'Lot B (Faculty)', 'North Garage'];

export const parkingSlots = [
  { id: 'A-01', type: 'FACULTY', status: 'occupied' },
  { id: 'A-02', type: 'VACANT', status: 'vacant' },
  { id: 'A-03', type: 'STUDENT', status: 'occupied' },
  { id: 'A-04', type: 'VIOLATION', status: 'violation' },
];

export const entryLog = [
  { plate: 'TX-782J9', model: 'Tesla Model 3', status: 'AUTHORIZED', gate: 'NORTH GATE', time: '14:22:10' },
  { plate: 'FL-420-X', model: 'Ford F-150', status: 'NO PERMIT', gate: 'WEST ENTRANCE', time: '14:15:33', isFlagged: true },
  { plate: 'NY-98B21', model: 'BMW X5', status: 'GUEST', gate: 'MAIN GATE', time: '14:12:00' },
];
