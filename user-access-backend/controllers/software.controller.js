const { AppDataSource } = require("../config/ormconfig");
const Software = require('../entities/Software');

module.exports = {
  createSoftware: async (req, res) => {
    const { name, description, accessLevels } = req.body;

    if (!name || !description || !Array.isArray(accessLevels) || accessLevels.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    try {
      const softwareRepo = AppDataSource.getRepository('Software');

      // Check if software with same name exists
      const existing = await softwareRepo.findOneBy({ name });
      if (existing) {
        return res.status(409).json({ message: 'Software already exists' });
      }

      const newSoftware = softwareRepo.create({
        name,
        description,
        accessLevels,
      });

      await softwareRepo.save(newSoftware);

      return res.status(201).json({ message: 'Software created successfully', software: newSoftware });
    } catch (error) {
      console.error('Create software error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getAllSoftware: async (req, res) => {
    try {
      const softwareRepo = AppDataSource.getRepository(Software);
      const softwareList = await softwareRepo.find();
      return res.json({ software: softwareList });
    } catch (error) {
      console.error('Error fetching software:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
