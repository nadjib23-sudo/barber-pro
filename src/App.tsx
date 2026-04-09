import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Printer, Settings, LayoutDashboard, History, Scissors, User, Search, X,
  CheckCircle2, TrendingUp, CreditCard, Calendar, Users, ShoppingBag, Tag, Percent,
  Wallet, FileText, ChevronDown, PlusCircle, Package, Star, Sparkles, BrainCircuit,
  Clock, Briefcase, Layers, ChevronLeft, ChevronRight, MoreVertical, BarChart3,
  LogOut, Menu, Barcode, Home, BookOpen, Zap, DollarSign, PieChart, UserPlus,
  Smile, MoreHorizontal, Edit, Filter, Download, LogIn
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Service, Sale, SaleItem, PaymentMethod, Staff, Product, Appointment, Client } from './types';
import { db, auth, loginWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, setDoc, updateDoc, deleteDoc, query, orderBy, getDocFromServer } from 'firebase/firestore';

const INITIAL_SERVICES: Service[] = [
  { id: '1', name: 'حلاقة شعر رجالي', price: 50, duration: 30, category: 'شعر', type: 'SERVICE' },
  { id: '2', name: 'حلاقة ذقن ملكي', price: 40, duration: 20, category: 'ذقن', type: 'SERVICE' },
  { id: '3', name: 'تنظيف بشرة عميق', price: 120, duration: 45, category: 'بشرة', type: 'SERVICE' },
  { id: '4', name: 'زيت لحية فاخر', price: 65, duration: 0, category: 'منتجات', type: 'PRODUCT' },
];

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pos' | 'appointments' | 'services' | 'inventory' | 'staff' | 'clients' | 'reports' | 'settings'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientSearch, setClientSearch] = useState('عميل نقدي (Walk-in)');
  const [isPrinting, setIsPrinting] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubServices = onSnapshot(collection(db, 'services'), (s) => setServices(s.docs.map(d => ({...d.data(), id: d.id} as Service))));
    const unsubStaff = onSnapshot(collection(db, 'staff'), (s) => setStaff(s.docs.map(d => ({...d.data(), id: d.id} as Staff))));
    const unsubProducts = onSnapshot(collection(db, 'products'), (s) => setProducts(s.docs.map(d => ({...d.data(), id: d.id} as Product))));
    const unsubClients = onSnapshot(collection(db, 'clients'), (s) => setClients(s.docs.map(d => ({...d.data(), id: d.id} as Client))));
    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (s) => setAppointments(s.docs.map(d => ({...d.data(), id: d.id} as Appointment))));
    const unsubSales = onSnapshot(query(collection(db, 'sales'), orderBy('timestamp', 'desc')), (s) => setSales(s.docs.map(d => ({...d.data(), id: d.id} as Sale))));

    return () => { unsubServices(); unsubStaff(); unsubProducts(); unsubClients(); unsubAppointments(); unsubSales(); };
  }, [user]);

  const checkout = async () => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const newSale = { items: cart, subtotal, total: subtotal, paymentMethod, clientName: clientSearch, timestamp: Date.now() };
    try {
      await addDoc(collection(db, 'sales'), newSale);
      setIsPrinting(true);
      setTimeout(() => { window.print(); setIsPrinting(false); setCart([]); }, 500);
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'sales'); }
  };

  if (!isAuthReady) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-6 max-w-md w-full">
        <Scissors className="w-16 h-16 text-indigo-600 mx-auto" />
        <h1 className="text-2xl font-bold">صالون برو</h1>
        <button onClick={loginWithGoogle} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3"><LogIn /> دخول عبر جوجل</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" dir="rtl">
      {/* ... بقية واجهة التطبيق (Sidebar, Header, Content) ... */}
    </div>
  );
}
