import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newListUsers, setNewListUsers] = useState('');
  const [newListBudget, setNewListBudget] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', addedBy: '' });
  const [split, setSplit] = useState(null);
  const [subscription, setSubscription] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [receiptFiles, setReceiptFiles] = useState([]);
  const eventSourceRef = useRef(null);

  // Real-time sync with SSE
  useEffect(() => {
    fetch(`${API_URL}/lists`).then(r => r.json()).then(setLists);
    eventSourceRef.current = new window.EventSource(`${API_URL}/stream`);
    eventSourceRef.current.onmessage = (e) => {
      setLists(JSON.parse(e.data));
    };
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (selectedList) {
      const updated = lists.find(l => l.id === selectedList.id);
      if (updated) setSelectedList(updated);
    }
  }, [lists]);

  useEffect(() => {
    if (selectedList && selectedList.receipts) {
      setReceiptFiles(selectedList.receipts);
    }
  }, [selectedList]);

  const createList = async () => {
    if (!newListName || !newListUsers) return;
    const users = newListUsers.split(',').map(u => u.trim()).filter(Boolean);
    await fetch(`${API_URL}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newListName, users, budget: newListBudget, subscription })
    });
    setNewListName('');
    setNewListUsers('');
    setNewListBudget('');
    setSubscription(false);
  };

  const selectList = (list) => {
    setSelectedList(list);
    setSplit(null);
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.addedBy) return;
    await fetch(`${API_URL}/lists/${selectedList.id}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    setNewItem({ name: '', price: '', addedBy: '' });
  };

  const removeItem = async (itemId) => {
    await fetch(`${API_URL}/lists/${selectedList.id}/items/${itemId}`, { method: 'DELETE' });
  };

  const getSplit = async () => {
    const res = await fetch(`${API_URL}/lists/${selectedList.id}/split`);
    setSplit(await res.json());
  };

  const updateBudget = async (budget) => {
    await fetch(`${API_URL}/lists/${selectedList.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budget })
    });
  };

  const updateSubscription = async (val) => {
    await fetch(`${API_URL}/lists/${selectedList.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: val })
    });
  };

  const markAsPaid = async (user) => {
    await fetch(`${API_URL}/lists/${selectedList.id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });
  };

  const uploadReceipt = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fetch(`${API_URL}/lists/${selectedList.id}/receipt`, {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      setUploadError('Upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="container">
      <h1>Shared Shopping List</h1>
      <div className="lists-section">
        <h2>Your Lists</h2>
        <ul>
          {lists.map(list => (
            <li key={list.id}>
              <button onClick={() => selectList(list)}>{list.name}</button>
            </li>
          ))}
        </ul>
        <div className="new-list-form">
          <input placeholder="List name" value={newListName} onChange={e => setNewListName(e.target.value)} />
          <input placeholder="Users (comma separated)" value={newListUsers} onChange={e => setNewListUsers(e.target.value)} />
          <input placeholder="Budget (KES)" type="number" value={newListBudget} onChange={e => setNewListBudget(e.target.value)} />
          <label style={{marginLeft:'1em'}}>
            <input type="checkbox" checked={subscription} onChange={e => setSubscription(e.target.checked)} /> Subscription (KES 100/mo)
          </label>
          <button onClick={createList}>Create List</button>
        </div>
      </div>
      {selectedList && (
        <div className="list-details">
          <h2>{selectedList.name}</h2>
          <p>Users: {selectedList.users.join(', ')}</p>
          <p>Budget: {selectedList.budget ? `KES ${selectedList.budget}` : 'Not set'} {' '}
            <input style={{width:'7em'}} type="number" placeholder="Set budget" onBlur={e => updateBudget(e.target.value)} />
          </p>
          <p>Subscription: {selectedList.subscription ? 'Active' : 'Inactive'} {' '}
            <button onClick={() => updateSubscription(!selectedList.subscription)}>
              {selectedList.subscription ? 'Cancel' : 'Activate'}
            </button>
          </p>
          <h3>Items</h3>
          <ul>
            {selectedList.items.map(item => (
              <li key={item.id}>
                {item.name} - KES {item.price} (by {item.addedBy})
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="add-item-form">
            <input placeholder="Item name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
            <input placeholder="Price" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
            <input placeholder="Added by" value={newItem.addedBy} onChange={e => setNewItem({ ...newItem, addedBy: e.target.value })} />
            <button onClick={addItem}>Add Item</button>
          </div>
          <button onClick={getSplit}>Split Cost</button>
          {split && (
            <div className="split-result">
              <h4>Total: KES {split.total}</h4>
              <h4>Each pays: KES {split.perUser}</h4>
              {split.budget && (
                <h4 style={{color: split.overBudget ? 'red' : 'green'}}>
                  {split.overBudget ? 'Over Budget!' : 'Within Budget'}
                </h4>
              )}
              <ul>
                {split.users.map(u => (
                  <li key={u}>{u}: KES {split.perUser}</li>
                ))}
              </ul>
            </div>
          )}
          <h3>Payments</h3>
          <ul>
            {selectedList.paymentStatus && selectedList.paymentStatus.map(ps => (
              <li key={ps.user}>
                {ps.user}: {ps.paid ? 'Paid' : 'Not Paid'}
                {!ps.paid && <button onClick={() => markAsPaid(ps.user)}>Mark as Paid</button>}
              </li>
            ))}
          </ul>
          <h3>Receipts</h3>
          <input type="file" onChange={uploadReceipt} disabled={uploading} />
          {uploadError && <div style={{color:'red'}}>{uploadError}</div>}
          <ul>
            {receiptFiles && receiptFiles.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
