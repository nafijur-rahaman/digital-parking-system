import { useState } from 'react';
import StatsGrid from '../components/stats/StatsGrid';
import ParkingMapPanel from '../components/map/ParkingMapPanel';
import EntryLogPanel from '../components/logs/EntryLogPanel';
import { entryLog, lotTabs, parkingSlots, stats } from '../data/dashboardData';

const seededSlots = parkingSlots.map((slot, index) => ({
  ...slot,
  memberId: slot.status === 'occupied' ? (3200 + index).toString() : null,
  otp: slot.status === 'occupied' ? '123456' : null,
}));

const LiveMapPage = () => {
  const [entries, setEntries] = useState(entryLog);
  const [slots, setSlots] = useState(seededSlots);
  const [sensorEvent, setSensorEvent] = useState({
    text: 'Monitoring entrance and exit scanners',
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
  });

  const stampNow = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

  const handleVehicleEntry = (vehicleEntry) => {
    const timestamp = stampNow();
    let allocatedSlotId = null;

    setSlots((previous) =>
      previous.map((slot) => {
        if (!allocatedSlotId && slot.status === 'vacant') {
          allocatedSlotId = slot.id;
          return { ...slot, status: 'occupied', type: 'STUDENT', memberId: vehicleEntry.memberId, otp: vehicleEntry.otp };
        }
        return slot;
      }),
    );

    setEntries((previous) => [{ memberId: vehicleEntry.memberId, plate: `ID-${vehicleEntry.memberId}`, status: 'AUTHORIZED', gate: vehicleEntry.gate, time: timestamp }, ...previous]);
    setSensorEvent({
      text: allocatedSlotId
        ? `Entry: ID ${vehicleEntry.memberId} assigned to ${allocatedSlotId}. OTP sent.`
        : `Entry: ID ${vehicleEntry.memberId} denied (no vacant slot)`,
      time: timestamp,
    });
  };

  const handleVehicleExit = ({ memberId, gate }) => {
    const timestamp = stampNow();
    let releasedSlotId = null;

    setEntries((previous) => [{ memberId, plate: `ID-${memberId}`, status: 'EXITED', gate, time: timestamp }, ...previous]);

    setSlots((previous) =>
      previous.map((slot) => {
        if (!releasedSlotId && slot.memberId === memberId) {
          releasedSlotId = slot.id;
          return { ...slot, status: 'vacant', type: 'VACANT', memberId: null, otp: null };
        }
        return slot;
      }),
    );

    setSensorEvent({
      text: releasedSlotId ? `Exit detected: ID ${memberId} released ${releasedSlotId}` : `Exit detected: ID ${memberId} left campus`,
      time: timestamp,
    });
  };

  return (
    <>
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-3 gap-6">
        <ParkingMapPanel lotTabs={lotTabs} slots={slots} sensorEvent={sensorEvent} />
        <EntryLogPanel
          entries={entries}
          activeSlots={slots.filter((slot) => slot.status === 'occupied' && slot.memberId)}
          onVehicleEntry={handleVehicleEntry}
          onVehicleExit={handleVehicleExit}
        />
      </div>
    </>
  );
};

export default LiveMapPage;
