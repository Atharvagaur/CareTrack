import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from './Modal.jsx';
import {
  ISSUE_CATEGORIES,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
  PRIORITY_META,
  STATUS_META,
} from '../constants/issues.js';
import { getApiErrorMessage } from '../api/issues.js';

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const LABEL_CLASS = 'mb-1 block text-xs font-medium text-slate-600';

function toFormState(issue) {
  return {
    title: issue?.title ?? '',
    description: issue?.description ?? '',
    category: issue?.category ?? ISSUE_CATEGORIES[0],
    priority: issue?.priority ?? 'medium',
    status: issue?.status ?? 'open',
    assignee: issue?.assignee ?? '',
  };
}

/**
 * Create/edit form. Calls onSubmit(payload, issue); the parent performs the
 * request and closes the modal on success, so this component only handles
 * submitting + showing errors.
 */
export default function IssueFormModal({ mode = 'create', issue, onClose, onSubmit }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(() => toFormState(issue));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(
        {
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          priority: form.priority,
          status: form.status,
          assignee: form.assignee.trim() ? form.assignee.trim() : null,
        },
        issue
      );
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save the issue'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={isEdit ? `Edit ${issue?.id ?? 'issue'}` : 'New issue'}
      onClose={submitting ? () => {} : onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="issue-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? 'Save changes' : 'Create issue'}
          </button>
        </>
      }
    >
      <form id="issue-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className={LABEL_CLASS} htmlFor="issue-title">
            Title
          </label>
          <input
            id="issue-title"
            type="text"
            required
            maxLength={200}
            value={form.title}
            onChange={update('title')}
            placeholder="Short summary of the operational issue"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="issue-description">
            Description
          </label>
          <textarea
            id="issue-description"
            required
            rows={4}
            maxLength={5000}
            value={form.description}
            onChange={update('description')}
            placeholder="What happened, where and what is needed to resolve it"
            className={`${INPUT_CLASS} resize-y`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASS} htmlFor="issue-category">
              Category
            </label>
            <select
              id="issue-category"
              value={form.category}
              onChange={update('category')}
              className={INPUT_CLASS}
            >
              {ISSUE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="issue-priority">
              Priority
            </label>
            <select
              id="issue-priority"
              value={form.priority}
              onChange={update('priority')}
              className={INPUT_CLASS}
            >
              {ISSUE_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_META[priority].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="issue-status">
              Status
            </label>
            <select
              id="issue-status"
              value={form.status}
              onChange={update('status')}
              className={INPUT_CLASS}
            >
              {ISSUE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_META[status].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="issue-assignee">
              Assignee <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="issue-assignee"
              type="text"
              maxLength={120}
              value={form.assignee}
              onChange={update('assignee')}
              placeholder="Unassigned"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
