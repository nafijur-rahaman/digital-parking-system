import { useState, useEffect, useCallback } from 'react';
import StatsGrid from '../components/stats/StatsGrid';
import ParkingMapPanel from '../components/map/ParkingMapPanel';
import EntryLogPanel from '../components/logs/EntryLogPanel';
import { getAllParkingLots, getAllBookings } from '../services/api';

const LiveMapPage = () => {
  const [lots, setLots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sensorEvent, setSensorEvent] = useState({
    text: 'Monitoring entrance and exit scanners',
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
  });

  const fetchData = useCallback(async () => {
    try {
      const [lotsData, bookingsData] = await Promise.all([
        getAllParkingLots(),
        getAllBookings(),
      ]);
      setLots(lotsData);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Failed to fetch parking data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Computed stats from real data
  const totalCapacity = lots.reduce((sum, l) => sum + l.total_capacity, 0);
  const totalOccupied = lots.reduce((sum, l) => sum + l.current_occupied, 0);
  const occupancyPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const activeBookings = bookings.filter((b) => b.status === 'active');

  const stats = [
    {
      title: 'TOTAL OCCUPANCY',
      value: String(totalOccupied),
      total: `/${totalCapacity}`,
      progress: occupancyPct,
      color: occupancyPct >= 90 ? 'red' : 'blue',
    },
    {
      title: 'ACTIVE BOOKINGS',
      value: String(activeBookings.length),
      total: 'Active',
      color: 'purple',
    },
  ];

  const handleBookingCreated = (booking, memberName) => {
    setSensorEvent({
      text: `Entry: ${memberName} assigned to ${booking.parking_lot_name}. Exit token emailed.`,
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    });
    fetchData();
  };

  const handleVehicleExited = (booking) => {
    setSensorEvent({
      text: `Exit: Booking #${booking.id} in ${booking.parking_lot_name} marked complete. Space freed.`,
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    });
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-3 gap-6">
        <ParkingMapPanel lots={lots} bookings={bookings} sensorEvent={sensorEvent} />
        <EntryLogPanel
          bookings={bookings}
          lots={lots}
          onBookingCreated={handleBookingCreated}
          onVehicleExited={handleVehicleExited}
        />
      </div>
    </>
  );
};

export default LiveMapPage;
