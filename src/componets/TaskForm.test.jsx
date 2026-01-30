import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from './TaskForm';

describe('TaskForm Component', () => {
  it('renders the trigger button correctly', () => {
    render(<TaskForm categories={[]} onAdd={() => {}} />);
    // בודקים רק שהכפתור שפותח את הדיאלוג קיים
    expect(screen.getByText(/משימה חדשה/i)).toBeInTheDocument();
  });

  it('opens dialog and submits a valid task', async () => {
    const mockOnAdd = vi.fn();
    render(<TaskForm categories={[]} onAdd={mockOnAdd} />);

    // 1. קודם כל לוחצים על הכפתור כדי לפתוח את הטופס
    const openButton = screen.getByText(/משימה חדשה/i);
    fireEvent.click(openButton);

    // 2. עכשיו (אחרי הלחיצה) בודקים שהשדה הופיע
    // שימוש ב-waitFor מבטיח שהחלון סיים להיפתח
    const input = await screen.findByPlaceholderText(/לדוגמה: לסיים את המצגת/i);
    expect(input).toBeInTheDocument();

    // 3. מכניסים טקסט
    fireEvent.change(input, { target: { value: 'Test Task' } });

    // 4. לוחצים על שמירה
    const saveButton = screen.getByText('שמור');
    fireEvent.click(saveButton);

    // 5. בודקים שהפונקציה נקראה
    expect(mockOnAdd).toHaveBeenCalled();
    expect(mockOnAdd).toHaveBeenCalledWith('Test Task', expect.anything(), expect.anything());
  });
});