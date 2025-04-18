// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const OrganizerDashboard = () => {
//   const [tournamentName, setTournamentName] = useState("");
//   const [stadium, setStadium] = useState("");
//   const [players, setPlayers] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [groupSize, setGroupSize] = useState(4); // Default group size

//   // Fetch list of players
//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("/api/players", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPlayers(response.data);
//       } catch (error) {
//         console.error("Error fetching players:", error);
//       }
//     };

//     fetchPlayers();
//   }, []);

//   // Handle creating a new tournament
//   const handleAddTournament = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "/api/tournaments",
//         { name: tournamentName, stadium },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert("Tournament added successfully!");
//       setTournamentName("");
//       setStadium("");
//     } catch (error) {
//       console.error("Error adding tournament:", error);
//       alert("Failed to add tournament.");
//     }
//   };

//   // Handle grouping players
//   const handleCreateGroups = () => {
//     if (players.length === 0) {
//       alert("No players available for grouping.");
//       return;
//     }
//     const shuffledPlayers = [...players].sort(() => Math.random() - 0.5); // Shuffle players
//     const newGroups = [];
//     for (let i = 0; i < shuffledPlayers.length; i += groupSize) {
//       newGroups.push(shuffledPlayers.slice(i, i + groupSize));
//     }
//     setGroups(newGroups);
//   };

//   return (
//     <div>
//       <h1>Organizer Dashboard</h1>

//       {/* Add Tournament Section */}
//       <h2>Add New Tournament</h2>
//       <input
//         type="text"
//         placeholder="Tournament Name"
//         value={tournamentName}
//         onChange={(e) => setTournamentName(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Stadium"
//         value={stadium}
//         onChange={(e) => setStadium(e.target.value)}
//       />
//       <button onClick={handleAddTournament}>Add Tournament</button>

//       {/* Group Players Section */}
//       <h2>Group Players</h2>
//       <label>
//         Group Size:
//         <input
//           type="number"
//           value={groupSize}
//           onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
//           min="1"
//         />
//       </label>
//       <button onClick={handleCreateGroups}>Create Groups</button>

//       {groups.length > 0 && (
//         <div>
//           <h3>Generated Groups</h3>
//           {groups.map((group, index) => (
//             <div key={index}>
//               <h4>Group {index + 1}</h4>
//               <ul>
//                 {group.map((player) => (
//                   <li key={player.id}>{player.name}</li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrganizerDashboard;
import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import TournamentItem from "./Components/TournamentItem";

const OrganizerDashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    stadium: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch tournaments on load
  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axiosClient.get(`/v1/tournaments`);
      setTournaments(response.data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.stadium || !form.location || !form.startDate || !form.endDate) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      if (editId) {
        // Update tournament
        await axiosClient.put(`/v1/tournaments/${editId}`, form);
        alert("Tournament updated successfully!");
        setEditId(null);
      } else {
        // Create new tournament
        console.log('asd', `/v1/tournaments`);

        const res = await axiosClient.post(`/v1/tournaments`, form);
        console.log('res', res);

        alert("Tournament added successfully!");
      }

      fetchTournaments();
      setForm({ name: "", stadium: "", location: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error saving tournament:", error);
      alert("Failed to save tournament.");
    }
  };

  const handleEdit = (tournament) => {
    setEditId(tournament._id);
    setForm(tournament);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      try {
        await axiosClient.delete(`/v1/tournaments/${id}`);
        alert("Tournament deleted successfully!");
        fetchTournaments();
      } catch (error) {
        console.error("Error deleting tournament:", error);
        alert("Failed to delete tournament.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600"
      style={{
      backgroundImage: `url('https://pbs.twimg.com/media/FNgxCoIVcAAwhNV?format=jpg&name=large')`,
      backgroundSize: 'cover', // Ensures the image covers the entire screen
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed', // Keeps the background fixed when scrolling
      height: '100vh', // Ensures full height
      width: '100vw', // Ensures full width
    }}>
      
      <h1 className="text-2xl font-bold mb-4">Organizer Dashboard</h1>

        {/* Add Tournament Form */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">{editId ? "Edit Tournament" : "Add New Tournament"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Tournament Name" value={form.name} onChange={handleChange} className="p-2 border rounded" />
            <input type="text" name="stadium" placeholder="Stadium" value={form.stadium} onChange={handleChange} className="p-2 border rounded" />
            <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="p-2 border rounded" />
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="p-2 border rounded" />
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="p-2 border rounded" />
            <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              {editId ? "Update Tournament" : "Add Tournament"}
            </button>
          </form>
        </div>

        {/* Tournament List */}
        <h2 className="text-xl font-semibold mb-3">Tournaments</h2>
        <div className="grid grid-cols-3 gap-4">
          {tournaments.map((tournament) => (
            <TournamentItem key={tournament._id} item={tournament} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>
  );
};

export default OrganizerDashboard;
