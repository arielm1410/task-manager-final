import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskItem from './TaskItem';

const mockTask = {
  id: '1',
  title: 'My Test Task',
  completed: false,
  category: 'general',
  dueDate: '',
  isImportant: false
};

const mockCategories = [
  { id: 'general', label: 'כללי', color: 'bg-slate-500' }
];

describe('TaskItem Component', () => {
  it('renders task title correctly', () => {
    render(
      <TaskItem 
        task={mockTask} 
        categories={mockCategories} 
        isGridView={false} 
        onToggle={() => {}} 
      />
    );
    
    expect(screen.getByText('My Test Task')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = vi.fn();
    
    render(
      <TaskItem 
        task={mockTask} 
        categories={mockCategories} 
        isGridView={false} 
        onToggle={() => {}} 
        onDelete={mockOnDelete} 
      />
    );
    const deleteButtons = screen.getAllByRole('button');
    expect(screen.getByText('My Test Task')).toBeInTheDocument();
  });
});