import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { zerodhaAPI, ordersAPI } from '@/services/api';
import ZerodhaConnect from '@/components/ZerodhaConnect';
import AccountInfo from '@/components/AccountInfo';
import WebhookInfo from '@/components/WebhookInfo';
import OrdersTable from '@/components/OrdersTable';
import PremiumIndicator from '@/components/PremiumIndicator';
import CustomIndicator from '@/components/CustomIndicator';
import {
    TrendingUp,
    LogOut,
    RefreshCw,
    Phone,
    MessageCircle,
    Wallet,
    Link2,
    ClipboardList,
    Sparkles,
    Code2,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

const PHONE_NUMBER = '+919876543210';
const WHATSAPP_LINK = `https://wa.me/${PHONE_NUMBER}`;

function Dashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState(null);
    const [connections, setConnections] = useState([]);
    const [accountInfo, setAccountInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const fetchData = useCallback(async () => {
        try {
            const [connectionsRes, ordersRes] = await Promise.all([
                zerodhaAPI.getConnections(),
                ordersAPI.getOrders()
            ]);

            setConnections(connectionsRes.data || []);
            setOrders(ordersRes.data || []);

            // Get account info if connected
            const activeConnection = connectionsRes.data?.find(c => c.status === 'connected');
            if (activeConnection) {
                try {
                    const accountRes = await zerodhaAPI.getAccountInfo();
                    setAccountInfo(accountRes.data);
                } catch (err) {
                    console.error('Failed to fetch account info:', err);
                    if (err.response?.status === 401) {
                        setAccountInfo(null);
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));

        // Check for success/error params from Zerodha callback
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (success === 'zerodha_connected') {
            showNotification('Zerodha connected successfully!', 'success');
        } else if (error) {
            showNotification(`Connection failed: ${error.replace(/_/g, ' ')}`, 'error');
        }

        fetchData();
    }, [navigate, searchParams, fetchData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const activeConnection = connections.find(c => c.status === 'connected');

    if (loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-8 w-8 text-green-500 animate-spin" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right ${notification.type === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                    }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={notification.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {notification.message}
                    </span>
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-40 glass">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Trading View Automation
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href={`tel:${PHONE_NUMBER}`} className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors">
                            <Phone className="h-4 w-4" />
                            <span>{PHONE_NUMBER}</span>
                        </a>
                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-2">
                                <MessageCircle className="h-4 w-4 text-green-500" />
                                <span className="hidden sm:inline">WhatsApp</span>
                            </Button>
                        </a>
                        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-red-400 hover:text-red-300">
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, <span className="text-green-500">{user?.name || 'Trader'}</span>!
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your trading automation and monitor your positions.
                    </p>
                </div>

                {/* Account Info with Exit All Button */}
                <AccountInfo
                    accountInfo={accountInfo}
                    connection={activeConnection}
                    onRefresh={handleRefresh}
                    showNotification={showNotification}
                />

                {/* Tabs */}
                <Tabs defaultValue="connection" className="mt-8">
                    <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2">
                        <TabsTrigger value="connection" className="gap-2 py-2">
                            <Link2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Connection</span>
                        </TabsTrigger>
                        <TabsTrigger value="webhook" className="gap-2 py-2">
                            <Wallet className="h-4 w-4" />
                            <span className="hidden sm:inline">Webhook</span>
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="gap-2 py-2">
                            <ClipboardList className="h-4 w-4" />
                            <span className="hidden sm:inline">Orders</span>
                        </TabsTrigger>
                        <TabsTrigger value="premium" className="gap-2 py-2">
                            <Sparkles className="h-4 w-4" />
                            <span className="hidden sm:inline">Premium</span>
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="gap-2 py-2">
                            <Code2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Custom</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="connection" className="mt-6">
                        <ZerodhaConnect
                            connections={connections}
                            onRefresh={fetchData}
                            showNotification={showNotification}
                        />
                    </TabsContent>

                    <TabsContent value="webhook" className="mt-6">
                        <WebhookInfo
                            user={user}
                            isConnected={!!activeConnection}
                            showNotification={showNotification}
                        />
                    </TabsContent>

                    <TabsContent value="orders" className="mt-6">
                        <OrdersTable orders={orders} />
                    </TabsContent>

                    <TabsContent value="premium" className="mt-6">
                        <PremiumIndicator />
                    </TabsContent>

                    <TabsContent value="custom" className="mt-6">
                        <CustomIndicator />
                    </TabsContent>
                </Tabs>
            </main>

            {/* Floating Call Button (Mobile) */}
            <div className="fixed bottom-4 right-4 md:hidden z-50">
                <a href={`tel:${PHONE_NUMBER}`}>
                    <Button variant="gradient" size="icon" className="h-14 w-14 rounded-full shadow-lg animate-pulse-glow">
                        <Phone className="h-6 w-6" />
                    </Button>
                </a>
            </div>
        </div>
    );
}

export default Dashboard;
