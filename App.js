import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, User, Mail, Phone, X, Check, ArrowLeft, Edit2, Trash2, Star, Filter } from 'lucide-react';

const ContactListApp = () => {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Raj Kumar', email: 'raj.kumar@example.com', phone: '+91 98765 43210', favorite: false, createdAt: Date.now() },
    { id: 2, name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43211', favorite: true, createdAt: Date.now() },
    { id: 3, name: 'Amit Patel', email: '', phone: '+91 98765 43212', favorite: false, createdAt: Date.now() },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@example.com', phone: '+91 98765 43213', favorite: false, createdAt: Date.now() },
    { id: 5, name: 'Vikram Singh', email: '', phone: '+91 98765 43214', favorite: true, createdAt: Date.now() },
    { id: 6, name: 'Anjali Desai', email: 'anjali.desai@example.com', phone: '+91 98765 43215', favorite: false, createdAt: Date.now() },
    { id: 7, name: 'Rohit Verma', email: '', phone: '+91 98765 43216', favorite: false, createdAt: Date.now() },
    { id: 8, name: 'Kavita Nair', email: 'kavita.nair@example.com', phone: '+91 98765 43217', favorite: false, createdAt: Date.now() },
    { id: 9, name: 'Arjun Mehta', email: 'arjun.mehta@example.com', phone: '+91 98765 43218', favorite: true, createdAt: Date.now() },
    { id: 10, name: 'Divya Iyer', email: '', phone: '+91 98765 43219', favorite: false, createdAt: Date.now() }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeAlphabet, setActiveAlphabet] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [sortMode, setSortMode] = useState('name');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const filteredContacts = useMemo(() => {
    let result = contacts;
    
    if (filterMode === 'favorites') {
      result = result.filter(c => c.favorite);
    } else if (filterMode === 'recent') {
      const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
      result = result.filter(c => c.createdAt > twoDaysAgo);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(contact => 
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.includes(query)
      );
    }
    
    if (sortMode === 'name') {
      return result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'recent') {
      return result.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    return result;
  }, [contacts, searchQuery, filterMode, sortMode]);

  const validateForm = (contact) => {
    const newErrors = {};
    
    if (!contact.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!contact.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Remove all non-digit characters except +
      const cleaned = contact.phone.replace(/[^\d+]/g, '');
      
      // Check if it's a valid international format (starts with +) or local format
      if (cleaned.startsWith('+')) {
        // International format: must have + followed by country code and number
        if (!/^\+\d{1,4}\d{6,14}$/.test(cleaned)) {
          newErrors.phone = 'Please enter a valid phone number (e.g., +1 234 567 8900 or +91 98765 43210)';
        }
      } else {
        // Local format: assume Indian number
        if (!/^[6-9]\d{9}$/.test(cleaned)) {
          newErrors.phone = 'Please enter a valid phone number (10 digits starting with 6-9)';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If already has + at the start, it's international
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // If starts with 91 and has 12 digits total, it's Indian with country code
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      const number = cleaned.substring(2);
      return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
    }
    
    // If 10 digits starting with 6-9, add +91
    if (/^[6-9]\d{9}$/.test(cleaned)) {
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    
    // Otherwise return as is (for other international numbers)
    return phone;
  };

  const handleAddContact = () => {
    if (!validateForm(newContact)) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const newId = Math.max(...contacts.map(c => c.id)) + 1;
      const formattedPhone = formatPhoneNumber(newContact.phone);
      setContacts([...contacts, { 
        id: newId, 
        ...newContact, 
        phone: formattedPhone,
        favorite: false,
        createdAt: Date.now()
      }]);
      setNewContact({ name: '', email: '', phone: '' });
      setErrors({});
      setShowAddModal(false);
      setIsLoading(false);
    }, 600);
  };

  const handleEditContact = () => {
    if (!validateForm(editingContact)) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const formattedPhone = formatPhoneNumber(editingContact.phone);
      const updatedContact = { ...editingContact, phone: formattedPhone };
      
      setContacts(contacts.map(c => 
        c.id === editingContact.id ? updatedContact : c
      ));
      
      if (selectedContact && selectedContact.id === editingContact.id) {
        setSelectedContact(updatedContact);
      }
      
      setEditingContact(null);
      setErrors({});
      setIsLoading(false);
    }, 600);
  };

  const toggleFavorite = (contactId, e) => {
    if (e) e.stopPropagation();
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, favorite: !c.favorite } : c
    ));
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact({ ...selectedContact, favorite: !selectedContact.favorite });
    }
  };

  const openEditPage = (contact) => {
    setEditingContact({ ...contact });
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setErrors({});
  };

  const handleDeleteContact = (id) => {
    const contact = contacts.find(c => c.id === id);
    setContactToDelete(contact);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      setContacts(contacts.filter(c => c.id !== contactToDelete.id));
      setShowDeleteConfirm(false);
      setContactToDelete(null);
      if (selectedContact || editingContact) {
        setSelectedContact(null);
        setEditingContact(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setContactToDelete(null);
  };

  const handleInputChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditingContact({ ...editingContact, [field]: value });
    } else {
      setNewContact({ ...newContact, [field]: value });
    }
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setNewContact({ name: '', email: '', phone: '' });
    setErrors({});
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const groupedContacts = useMemo(() => {
    if (sortMode !== 'name') return { 'All': filteredContacts };
    
    const groups = {};
    filteredContacts.forEach(contact => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });
    return groups;
  }, [filteredContacts, sortMode]);

  const availableAlphabets = useMemo(() => {
    if (sortMode !== 'name') return [];
    return Object.keys(groupedContacts).sort();
  }, [groupedContacts, sortMode]);

  const scrollToAlphabet = (letter) => {
    setActiveAlphabet(letter);
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const favoriteCount = contacts.filter(c => c.favorite).length;

  // Edit Contact Page
  if (editingContact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 animate-fadeIn">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={cancelEdit}
              className="p-2 hover:bg-white rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={24} className="text-slate-700" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800">
              Edit Contact
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full text-white text-3xl font-bold mb-4 shadow-xl animate-scaleIn">
                {getInitials(editingContact.name || 'NA')}
              </div>
            </div>

            <div className="space-y-5">
              <div className="transform transition-all duration-200 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editingContact.name}
                  onChange={(e) => handleInputChange('name', e.target.value, true)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-lg transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-slate-200 focus:border-slate-500'
                  }`}
                  placeholder="Rahul Kumar"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 animate-slideIn">{errors.name}</p>
                )}
              </div>

              <div className="transform transition-all duration-200 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={editingContact.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value, true)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-lg transition-all duration-200 ${
                    errors.phone ? 'border-red-500' : 'border-slate-200 focus:border-slate-500'
                  }`}
                  placeholder="98765 43210 or +91 98765 43210"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2 animate-slideIn">{errors.phone}</p>
                )}
              </div>

              <div className="transform transition-all duration-200 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={editingContact.email}
                  onChange={(e) => handleInputChange('email', e.target.value, true)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-lg transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-slate-200 focus:border-slate-500'
                  }`}
                  placeholder="rahul.kumar@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 animate-slideIn">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold text-lg transform hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                onClick={handleEditContact}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={22} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-slate-100">
              <button
                onClick={() => handleDeleteContact(editingContact.id)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 transform hover:scale-[1.02]"
              >
                <Trash2 size={18} />
                Delete Contact
              </button>
            </div>
          </div>
        </div>

        {showDeleteConfirm && contactToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Delete Contact
                </h3>
                <p className="text-slate-600 mb-6">
                  Do you want to delete <span className="font-semibold">{contactToDelete.name}</span> permanently?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Contact Detail View
  if (selectedContact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 animate-fadeIn">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-white rounded-xl transition-all duration-200"
              >
                <ArrowLeft size={24} className="text-slate-700" />
              </button>
              <h2 className="text-2xl font-bold text-slate-800">
                Contact Info
              </h2>
            </div>
            <button
              onClick={(e) => toggleFavorite(selectedContact.id, e)}
              className="p-2 hover:bg-white rounded-xl transition-all duration-200"
            >
              <Star
                size={24}
                className={`transition-all duration-300 ${
                  selectedContact.favorite 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'text-slate-400 hover:text-amber-400'
                }`}
              />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 px-6 py-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full text-slate-800 text-5xl font-bold mb-4 shadow-2xl animate-scaleIn">
                  {getInitials(selectedContact.name)}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{selectedContact.name}</h1>
                {selectedContact.favorite && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-100 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                    <Star size={14} className="fill-amber-300" />
                    Favorite
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 space-y-1">
              <div className="border-b-2 border-slate-100 pb-5 mb-5">
                <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide font-semibold">Phone</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-xl">
                      <Phone size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-800">{selectedContact.phone}</div>
                      <div className="text-sm text-slate-500">Mobile</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl transition-all duration-200 text-sm font-semibold shadow-md transform hover:scale-105"
                  >
                    Call
                  </a>
                </div>
              </div>

              {selectedContact.email && (
                <div className="border-b-2 border-slate-100 pb-5 mb-5">
                  <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide font-semibold">Email</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Mail size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-lg font-semibold text-slate-800 break-all">{selectedContact.email}</div>
                        <div className="text-sm text-slate-500">Personal</div>
                      </div>
                    </div>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-all duration-200 text-sm font-semibold shadow-md transform hover:scale-105 flex-shrink-0 ml-2"
                    >
                      Email
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => openEditPage(selectedContact)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteContact(selectedContact.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && contactToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Delete Contact
                </h3>
                <p className="text-slate-600 mb-6">
                  Do you want to delete <span className="font-semibold">{contactToDelete.name}</span> permanently?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Contact List View
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 transition-all duration-700 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold text-slate-800 mb-2">
                Contact Directory
              </h1>
              <p className="text-slate-600 text-lg">Manage and search your contacts with ease</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => {
                setFilterMode('all');
                setShowFilters(true);
              }}
              className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all duration-200 text-left transform hover:scale-[1.02]"
            >
              <div className="text-3xl font-bold text-slate-800">
                {contacts.length}
              </div>
              <div className="text-sm text-slate-600 font-medium">Total Contacts</div>
            </button>
            <button
              onClick={() => {
                setFilterMode('favorites');
                setShowFilters(true);
              }}
              className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-200 text-left transform hover:scale-[1.02]"
            >
              <div className="text-3xl font-bold text-amber-600">
                {favoriteCount}
              </div>
              <div className="text-sm text-slate-600 font-medium">Favorites</div>
            </button>
          </div>
        </div>

        {/* Search, Filter and Add Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-2 border-slate-200 animate-slideUp">
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-semibold border-2 ${
                showFilters 
                  ? 'bg-slate-100 border-slate-400 text-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              <Filter size={20} />
              Filters
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-semibold shadow-md transform hover:scale-105"
            >
              <Plus size={20} />
              Add Contact
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t-2 border-slate-200 space-y-3 animate-slideDown">
              <div className="flex gap-3 items-center flex-wrap">
                <span className="text-sm font-semibold text-slate-700">Show:</span>
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    filterMode === 'all'
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({contacts.length})
                </button>
                <button
                  onClick={() => setFilterMode('favorites')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                    filterMode === 'favorites'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Star size={14} className={filterMode === 'favorites' ? 'fill-white' : ''} />
                  Favorites ({favoriteCount})
                </button>
              </div>

              <div className="flex gap-3 items-center flex-wrap">
                <span className="text-sm font-semibold text-slate-700">Sort by:</span>
                <button
                  onClick={() => setSortMode('name')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    sortMode === 'name'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Name (A-Z)
                </button>
                <button
                  onClick={() => setSortMode('recent')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    sortMode === 'recent'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Recently Added
                </button>
              </div>

              <div className="flex gap-3 items-center flex-wrap">
                <span className="text-sm font-semibold text-slate-700">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-slate-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-slate-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Alphabet Slider */}
        {!searchQuery && sortMode === 'name' && availableAlphabets.length > 0 && (
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white rounded-full shadow-xl py-2 px-1.5 border-2 border-slate-200">
            <div className="flex flex-col items-center gap-0.5 max-h-[500px] overflow-y-auto scrollbar-hide">
              {availableAlphabets.map((letter) => (
                <button
                  key={letter}
                  onClick={() => scrollToAlphabet(letter)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                    activeAlphabet === letter
                      ? 'bg-slate-800 text-white scale-110 shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:scale-105'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact List */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border-2 border-slate-200 animate-fadeIn">
            <User className="mx-auto mb-4 text-slate-300" size={64} />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No contacts found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Start by adding a new contact'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-md transform hover:scale-105"
            >
              Add Your First Contact
            </button>
          </div>
        ) : (
          <div className={`space-y-6 ${sortMode === 'name' ? 'pr-16' : ''}`}>
            {Object.entries(groupedContacts).map(([letter, contactsInGroup], groupIndex) => (
              <div 
                key={letter} 
                id={`section-${letter}`}
                className="animate-slideUp"
                style={{ animationDelay: `${groupIndex * 50}ms` }}
              >
                {/* Alphabet Header */}
                {sortMode === 'name' && (
                  <div className="sticky top-0 z-10 bg-slate-100 px-5 py-3 rounded-xl mb-4 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">
                      {letter}
                    </h2>
                  </div>
                )}

                {/* Contacts Grid/List */}
                <div className={viewMode === 'grid' 
                  ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' 
                  : 'space-y-3'
                }>
                  {contactsInGroup.map((contact, index) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-slate-200 hover:border-slate-400 text-left w-full transform hover:scale-[1.02] group animate-scaleIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className={`flex items-start gap-4 ${viewMode === 'list' ? 'items-center' : ''}`}>
                        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl w-16 h-16 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                          {getInitials(contact.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-slate-800 truncate">
                              {contact.name}
                            </h3>
                            {contact.favorite && (
                              <Star size={16} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <Phone size={14} className="text-emerald-600 flex-shrink-0" />
                              <span className="font-medium truncate">{contact.phone}</span>
                            </div>
                            {contact.email && (
                              <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Mail size={14} className="text-blue-600 flex-shrink-0" />
                                <span className="truncate">{contact.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(contact.id, e)}
                          className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Star
                            size={18}
                            className={`transition-all duration-300 ${
                              contact.favorite 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-400 hover:text-amber-400'
                            }`}
                          />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Contact Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Add New Contact
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="transform transition-all duration-200 hover:scale-[1.01]">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 ${
                      errors.name ? 'border-red-500' : 'border-slate-200 focus:border-slate-500'
                    }`}
                    placeholder="Rahul Kumar"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 animate-slideIn">{errors.name}</p>
                  )}
                </div>

                <div className="transform transition-all duration-200 hover:scale-[1.01]">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-slate-200 focus:border-slate-500'
                    }`}
                    placeholder="rahul.kumar@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 animate-slideIn">{errors.email}</p>
                  )}
                </div>

                <div className="transform transition-all duration-200 hover:scale-[1.01]">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 ${
                      errors.phone ? 'border-red-500' : 'border-slate-200 focus:border-slate-500'
                    }`}
                    placeholder="+91 98765 43210 or +1 234 567 8900"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-2 animate-slideIn">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold transform hover:scale-[1.02]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Add Contact
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ContactListApp;