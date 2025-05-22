const { AppDataSource } = require("../config/ormconfig");
const Request = require('../entities/Request');
const Software = require('../entities/Software');
const User = require('../entities/User');

module.exports = {
  createRequest: async (req, res) => {
    const { softwareId, accessType, reason } = req.body;
    const userId = req.user.userId;

    if (!softwareId || !accessType || !reason) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    try {
      const softwareRepo = AppDataSource.getRepository('Software');
      const requestRepo = AppDataSource.getRepository('Request');
      const userRepo = AppDataSource.getRepository('User');

      const software = await softwareRepo.findOneBy({ id: softwareId });
      if (!software) {
        return res.status(404).json({ message: 'Software not found' });
      }

      // Validate accessType is within software.accessLevels
      if (!software.accessLevels.includes(accessType)) {
        return res.status(400).json({ message: `Invalid access type for this software. Allowed: ${software.accessLevels.join(', ')}` });
      }

      const user = await userRepo.findOneBy({ id: userId });
      if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
      }

      const newRequest = requestRepo.create({
        user,
        software,
        accessType,
        reason,
        status: 'Pending',
      });

      await requestRepo.save(newRequest);

      return res.status(201).json({ message: 'Access request created', request: newRequest });
    } catch (error) {
      console.error('Create request error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateRequest: async (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body; // Expected 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "Approved" or "Rejected".' });
    }

    try {
      const requestRepo = AppDataSource.getRepository('Request');

      const request = await requestRepo.findOneBy({ id: requestId });
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (request.status !== 'Pending') {
        return res.status(400).json({ message: 'Request already processed' });
      }

      request.status = status;
      await requestRepo.save(request);

      return res.json({ message: `Request ${status.toLowerCase()} successfully`, request });
    } catch (error) {
      console.error('Update request error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },


  // getMyRequests: async (req, res) => {
  //   try {
  //     const userId = req.user.userId;
  //     const requestRepo = AppDataSource.getRepository(Request);

  //     const requests = await requestRepo.find({
  //       where: { user: { id: userId } },
  //       relations: ['software'], 
  //     });

  //     return res.json({ requests });
  //   } catch (error) {
  //     console.error('Error fetching user requests:', error);
  //     return res.status(500).json({ message: 'Internal server error' });
  //   }
  // },
  getMyRequests: async (req, res) => {
    try {
      const userId = req.user.userId;
      const userRole = req.user.role;  // Assuming role is attached in req.user
  
      const requestRepo = AppDataSource.getRepository('Request');
  
      let requests;
  
      if (userRole === 'Admin' || userRole === 'Manager') {
        // Admin and Manager get all requests
        requests = await requestRepo.find({
          relations: ['user', 'software'], 
        });
      } else if (userRole === 'Employee') {
        // Employee gets only their own requests
        requests = await requestRepo.find({
          where: { user: { id: userId } },
          relations: ['software'],
        });
      } else {
        // If role is unknown or unauthorized
        return res.status(403).json({ message: 'Access denied' });
      }
  
      return res.json({ requests });
    } catch (error) {
      console.error('Error fetching user requests:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  getAllRequests : async (req, res) => {
    try {
      const requestRepo = AppDataSource.getRepository('Request');
      const requests = await requestRepo.find({
        relations: ['user', 'software'],
      });
      return res.json({ requests });
    } catch (error) {
      console.error('Error fetching all requests:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};

