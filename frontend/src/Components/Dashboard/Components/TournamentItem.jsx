import React from 'react'

const TournamentItem = ({ item, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p><strong>Stadium:</strong> {item.stadium}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Start:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(item.endDate).toLocaleDateString()}</p>
            <div className="mt-2">
                <button onClick={() => onEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">
                    Edit
                </button>
                <button onClick={() => onDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                </button>
            </div>
        </div>
    )
}

export default TournamentItem