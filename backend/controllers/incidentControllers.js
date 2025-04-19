const Incident = require('../models/Incident');

const incidentController = {
    createIncident: async (req, res) => {
        const { reporter, match, type, description } = req.body;
        try {
            const now = new Date();
            const incident = new Incident({ reporter, match, type, description, reportedAt: now });
            await incident.save();
            res.status(201).json(incident);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getIncidents: async (req, res) => {
        try {
            const incidents = await Incident.find();
            res.status(200).json(incidents);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getIncidentById: async (req, res) => {
        try {
            const incident = await Incident.findById(req.params.id);
            if (!incident) {
                return res.status(404).json({ message: 'Incident not found' });
            }
            res.status(200).json(incident);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateIncident: async (req, res) => {
        try {
            const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!incident) {
                return res.status(404).json({ message: 'Incident not found' });
            }
            res.status(200).json(incident);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteIncident: async (req, res) => {
        try {
            const incident = await Incident.findByIdAndDelete(req.params.id);
            if (!incident) {
                return res.status(404).json({ message: 'Incident not found' });
            }
            res.status(200).json({ message: 'Incident deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    resolveIncident: async (req, res) => {
        try {
            const { resolutionNote, resolvedBy } = req.body;
            const now = new Date();
            const incident = await Incident.findByIdAndUpdate(req.params.id, { status: 'resolved', resolutionNote, resolvedBy, resolvedAt: now }, { new: true });
            if (!incident) {
                return res.status(404).json({ message: 'Incident not found' });
            }
            res.status(200).json(incident);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    dismissIncident: async (req, res) => {
        try {
            const incident = await Incident.findByIdAndUpdate(req.params.id, { status: 'dismissed' }, { new: true });
            if (!incident) {
                return res.status(404).json({ message: 'Incident not found' });
            }
            res.status(200).json(incident);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getIncidentsByStatus: async (req, res) => {
        try {
            const incidents = await Incident.find({ status: req.params.status });
            res.status(200).json(incidents);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = incidentController;
