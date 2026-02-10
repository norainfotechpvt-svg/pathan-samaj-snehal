import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import MemberList from './components/MemberList';
import Fund from './components/Fund';
import About from './components/About';
import DikriYojana from './components/DikriYojana';
import { Member, ViewState, Donation } from './types';

// Initial Mock Data - Only used if NO data is in local storage
const INITIAL_MEMBERS: Member[] = [
  {
    id: "4092",
    firstName: "રમેશભાઈ",
    surname: "પટેલ",
    gender: "male",
    maritalStatus: "married",
    wifeName: "સુરેખાબેન",
    city: "રાજકોટ",
    role: "president",
    education: "B.Com",
    occupation: "Business",
    annualIncome: "500000",
    spouseEducation: "12th",
    spouseOccupation: "Housewife",
    spouseIncome: "0",
    community: "patel",
    subCaste: "leuva",
    registrationFee: 34000,
    registrationDate: "2023-01-15",
    donations: []
  },
  {
    id: "2190",
    firstName: "ઈમરાન",
    surname: "પઠાન",
    gender: "male",
    maritalStatus: "unmarried",
    fatherName: "યુસુફભાઈ",
    city: "અમદાવાદ",
    role: "member",
    age: "24",
    education: "B.E. Civil",
    occupation: "Engineer",
    annualIncome: "350000",
    community: "muslim",
    subCaste: "pathan",
    registrationFee: 9000,
    registrationDate: "2023-02-20",
    donations: []
  },
  {
    id: "3321",
    firstName: "આયશા",
    surname: "શેખ",
    gender: "female",
    maritalStatus: "married",
    husbandName: "રિયાઝભાઈ",
    useHusbandNameSuffix: true,
    city: "સુરત",
    role: "member",
    age: "28",
    education: "M.Com",
    occupation: "Teacher",
    annualIncome: "250000",
    spouseEducation: "MBA",
    spouseOccupation: "Manager",
    spouseIncome: "600000",
    community: "muslim",
    subCaste: "sunni",
    registrationFee: 9000,
    registrationDate: "2023-05-10",
    donations: []
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // SAFE DATA LOADING: Check localStorage immediately on load
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const storedMembers = localStorage.getItem('pst_members');
      return storedMembers ? JSON.parse(storedMembers) : INITIAL_MEMBERS;
    } catch (error) {
      console.error("Error loading members:", error);
      return INITIAL_MEMBERS;
    }
  });

  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);

  // Save to localStorage whenever members change
  useEffect(() => {
    localStorage.setItem('pst_members', JSON.stringify(members));
  }, [members]);

  const handleRegisterMember = (newMember: Member) => {
    if (editingMember) {
      // Update existing
      setMembers(members.map(m => m.id === newMember.id ? newMember : m));
      setEditingMember(undefined);
      alert('સભ્યની વિગતો સફળતાપૂર્વક અપડેટ થઈ ગઈ છે!');
    } else {
      // Check for duplicate ID
      if (members.some(m => m.id === newMember.id)) {
        alert('Error: Duplicate ID Generated. Please try again.');
        return;
      }
      setMembers([...members, newMember]);
      alert(`નવા સભ્ય સફળતાપૂર્વક ઉમેરાયા! રજિસ્ટર નંબર: ${newMember.id}`);
    }
    setCurrentView('dashboard');
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
    // Check if schemes were added to show specific message
    if (updatedMember.schemes && updatedMember.schemes.length > (members.find(m => m.id === updatedMember.id)?.schemes?.length || 0)) {
       alert('યોજનાની રકમ મંજૂર કરવામાં આવી છે અને સભ્યના રેકોર્ડમાં ઉમેરવામાં આવી છે!');
    } else {
       alert('વિગતો સફળતાપૂર્વક અપડેટ કરવામાં આવી છે!');
    }
  };

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setCurrentView('register');
  };

  const handleDonation = (memberId: string, donation: Donation) => {
    const updatedMembers = members.map(member => {
      if (member.id === memberId) {
        const currentDonations = member.donations || [];
        return { ...member, donations: [...currentDonations, donation] };
      }
      return member;
    });
    setMembers(updatedMembers);
    alert('દાન સફળતાપૂર્વક જમા કરવામાં આવ્યું છે!');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setEditingMember(undefined);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onChangeView={setCurrentView} 
            memberCount={members.length}
          />
        );
      case 'register':
        return (
          <RegistrationForm 
            onBack={handleBackToDashboard}
            onSubmit={handleRegisterMember}
            existingMember={editingMember}
            members={members} 
          />
        );
      case 'list':
        return (
          <MemberList 
            members={members} 
            onBack={handleBackToDashboard} 
            onEdit={handleEditClick}
          />
        );
      case 'fund':
        return (
          <Fund 
            onBack={handleBackToDashboard} 
            members={members} 
            onDonate={handleDonation}
          />
        );
      case 'dikri_yojana':
        return (
          <DikriYojana 
            onBack={handleBackToDashboard}
            members={members}
            onUpdateMember={handleUpdateMember}
          />
        );
      case 'about':
        return <About onBack={handleBackToDashboard} />;
      default:
        return <Dashboard onChangeView={setCurrentView} memberCount={members.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header onHome={handleBackToDashboard} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="bg-teal-800 text-teal-200 py-4 text-center text-sm">
        <p>© 2024 Pathan Samaj Trust. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;