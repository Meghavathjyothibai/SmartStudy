const { body, validationResult } = require('express-validator');

// Validation rules
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    // Log the full error details
    console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  };
};

// User validation rules
const userValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number')
  ],
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ]
};

// Task validation rules - WITH TIME VALIDATION
const taskValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 100 }).withMessage('Title too long'),
    body('subject')
      .trim()
      .notEmpty().withMessage('Subject is required'),
    body('estimatedDuration')
      .isInt({ min: 5, max: 480 }).withMessage('Duration must be 5-480 minutes'),
    body('dueDate')
      .notEmpty().withMessage('Due date is required')
      .custom((value, { req }) => {
        console.log('Raw dueDate value:', value);
        
        // Create date objects and set to midnight for comparison
        const dueDate = new Date(value);
        if (isNaN(dueDate.getTime())) {
          throw new Error('Invalid date format');
        }
        
        const today = new Date();
        
        // Set both dates to midnight (00:00:00) for fair comparison
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        
        console.log('Today (midnight):', today.toISOString());
        console.log('Due date (midnight):', dueDate.toISOString());
        console.log('Comparison:', dueDate < today ? 'Past' : 'Today/Future');
        
        // Compare using date objects, not strings
        if (dueDate < today) {
          throw new Error('Due date cannot be in the past');
        }
        
        // Store in YYYY-MM-DD format
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0');
        const day = String(dueDate.getDate()).padStart(2, '0');
        req.body.dueDate = `${year}-${month}-${day}`;
        
        return true;
      }),
    // NEW: Start time validation
    body('startTime')
      .notEmpty().withMessage('Start time is required')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Start time must be in HH:MM format (e.g., 09:00, 14:30)'),
    // NEW: End time validation
    body('endTime')
      .notEmpty().withMessage('End time is required')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('End time must be in HH:MM format (e.g., 10:30, 15:45)')
      .custom((value, { req }) => {
        if (value <= req.body.startTime) {
          throw new Error('End time must be after start time');
        }
        return true;
      }),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Title too long'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
    body('progress')
      .optional()
      .isInt({ min: 0, max: 100 }).withMessage('Progress must be 0-100')
  ]
};

module.exports = {
  validate,
  userValidation,
  taskValidation
};