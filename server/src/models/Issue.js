import mongoose from 'mongoose';
import {
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  ISSUE_CATEGORIES,
} from '../constants/issues.js';

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must be 200 characters or fewer'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description must be 5000 characters or fewer'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ISSUE_CATEGORIES,
        message: `Category must be one of: ${ISSUE_CATEGORIES.join(', ')}`,
      },
    },
    priority: {
      type: String,
      required: true,
      enum: {
        values: ISSUE_PRIORITIES,
        message: `Priority must be one of: ${ISSUE_PRIORITIES.join(', ')}`,
      },
      default: 'medium',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ISSUE_STATUSES,
        message: `Status must be one of: ${ISSUE_STATUSES.join(', ')}`,
      },
      default: 'open',
    },
    assignee: {
      type: String,
      trim: true,
      maxlength: [120, 'Assignee must be 120 characters or fewer'],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// Expose display labels alongside the stored enum keys for convenience.
issueSchema.virtual('statusLabel').get(function statusLabel() {
  return ISSUE_STATUS_LABELS[this.status] ?? this.status;
});

issueSchema.virtual('priorityLabel').get(function priorityLabel() {
  return ISSUE_PRIORITY_LABELS[this.priority] ?? this.priority;
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
