const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function submitBankTransfer(file) {
    const formData = new FormData();
    formData.append('screenshot', file);

    const response = await fetch(`${API_URL}/api/bank-transfer`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit payment');
    }

    return data;
}

export async function submitUsdt(transactionLink) {
    const response = await fetch(`${API_URL}/api/usdt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_link: transactionLink }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit payment');
    }

    return data;
}