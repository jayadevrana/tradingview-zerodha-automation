import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { zerodhaAPI } from '@/services/api';
import {
    Link2,
    ExternalLink,
    Trash2,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Clock,
    Loader2,
    Shield
} from 'lucide-react';

function ZerodhaConnect({ connections, onRefresh, showNotification }) {
    const [formData, setFormData] = useState({ api_key: '', api_secret: '' });
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [reconnectingId, setReconnectingId] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConnect = async (e) => {
        e.preventDefault();

        if (!formData.api_key || !formData.api_secret) {
            showNotification('Please enter both API Key and API Secret', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await zerodhaAPI.connect(formData);
            // Redirect to Zerodha login
            window.location.href = response.data.login_url;
        } catch (err) {
            showNotification(err.response?.data?.detail || 'Failed to initiate connection', 'error');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await zerodhaAPI.deleteConnection(id);
            showNotification('Connection deleted successfully', 'success');
            onRefresh();
        } catch (err) {
            showNotification(err.response?.data?.detail || 'Failed to delete connection', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const handleReconnect = async (id) => {
        setReconnectingId(id);
        try {
            const response = await zerodhaAPI.reconnect(id);
            window.location.href = response.data.login_url;
        } catch (err) {
            showNotification(err.response?.data?.detail || 'Failed to initiate reconnection', 'error');
            setReconnectingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'connected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Connected
                    </span>
                );
            case 'error':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        Error
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                        <Clock className="h-3 w-3" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                        {status}
                    </span>
                );
        }
    };

    const activeConnection = connections.find(c => c.status === 'connected');

    return (
        <div className="space-y-6">
            {/* Connection Form */}
            {!activeConnection && (
                <Card className="glass border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link2 className="h-6 w-6 text-green-500" />
                            Connect Zerodha Account
                        </CardTitle>
                        <CardDescription>
                            Enter your Zerodha Kite Connect API credentials to enable auto-trading
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleConnect} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="api_key">API Key</Label>
                                    <Input
                                        id="api_key"
                                        name="api_key"
                                        placeholder="Enter your API Key"
                                        value={formData.api_key}
                                        onChange={handleChange}
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="api_secret">API Secret</Label>
                                    <Input
                                        id="api_secret"
                                        name="api_secret"
                                        type="password"
                                        placeholder="Enter your API Secret"
                                        value={formData.api_secret}
                                        onChange={handleChange}
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-lg p-4">
                                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    How to get API credentials:
                                </h4>
                                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                    <li>Go to <a href="https://developers.kite.trade" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">developers.kite.trade</a></li>
                                    <li>Create a new app or use existing one</li>
                                    <li>Copy the API Key and API Secret</li>
                                    <li>Set Redirect URL to your backend callback URL</li>
                                </ol>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                className="w-full gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink className="h-4 w-4" />
                                        Connect to Zerodha
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Existing Connections */}
            {connections.length > 0 && (
                <Card className="glass border-0">
                    <CardHeader>
                        <CardTitle>Your Connections</CardTitle>
                        <CardDescription>
                            Manage your broker connections
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {connections.map((conn) => (
                                <div
                                    key={conn.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                            <span className="text-orange-500 font-bold text-sm">Z</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{conn.broker}</span>
                                                {getStatusBadge(conn.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                API Key: {conn.api_key?.slice(0, 8)}...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {conn.status !== 'connected' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleReconnect(conn.id)}
                                                disabled={reconnectingId === conn.id}
                                                className="gap-2"
                                            >
                                                {reconnectingId === conn.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <RefreshCw className="h-4 w-4" />
                                                )}
                                                Reconnect
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(conn.id)}
                                            disabled={deletingId === conn.id}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            {deletingId === conn.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default ZerodhaConnect;
