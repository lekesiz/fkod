import { Event } from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, location, capacity, eventType } = req.body;

    if (!title || !eventDate || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const event = await Event.create(
      req.user.id,
      title,
      description || '',
      eventDate,
      location,
      capacity || 100,
      eventType || 'workshop'
    );

    res.status(201).json(event);
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error('Get event error:', err);
    res.status(500).json({ error: 'Failed to get event' });
  }
};

export const listEvents = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const events = await Event.list(parseInt(limit), parseInt(offset));
    res.json(events);
  } catch (err) {
    console.error('List events error:', err);
    res.status(500).json({ error: 'Failed to list events' });
  }
};

export const searchEvents = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const events = await Event.search(q);
    res.json(events);
  } catch (err) {
    console.error('Search events error:', err);
    res.status(500).json({ error: 'Failed to search events' });
  }
};

export const filterEventsByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: 'Event type filter required' });
    }

    const events = await Event.filterByType(type);
    res.json(events);
  } catch (err) {
    console.error('Filter events error:', err);
    res.status(500).json({ error: 'Failed to filter events' });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const events = await Event.getUpcomingEvents(parseInt(limit));
    res.json(events);
  } catch (err) {
    console.error('Get upcoming events error:', err);
    res.status(500).json({ error: 'Failed to get upcoming events' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate, location, capacity, eventType } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizer_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedEvent = await Event.update(id, {
      title,
      description,
      event_date: eventDate,
      location,
      capacity,
      event_type: eventType,
    });

    res.json(updatedEvent);
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizer_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Event.delete(id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.attendees_count >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }

    const result = await Event.registerAttendee(eventId, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    console.error('Register for event error:', err);
    res.status(500).json({ error: 'Failed to register for event' });
  }
};

export const unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID required' });
    }

    const result = await Event.unregisterAttendee(eventId, req.user.id);
    res.json(result);
  } catch (err) {
    console.error('Unregister from event error:', err);
    res.status(500).json({ error: 'Failed to unregister from event' });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const attendees = await Event.getEventAttendees(eventId, parseInt(limit), parseInt(offset));
    res.json(attendees);
  } catch (err) {
    console.error('Get event attendees error:', err);
    res.status(500).json({ error: 'Failed to get event attendees' });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const events = await Event.getUserEvents(req.user.id, parseInt(limit), parseInt(offset));
    res.json(events);
  } catch (err) {
    console.error('Get user events error:', err);
    res.status(500).json({ error: 'Failed to get user events' });
  }
};
