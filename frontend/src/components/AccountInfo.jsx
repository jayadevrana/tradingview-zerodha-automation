import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { zerodhaAPI } from '@/services/api';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    XCircle,
    Loader2,
    RefreshCw,
    IndianRupee
} from 'lucide-react';

function AccountInfo({ accountInfo, connection, onRefresh, showNotification }) {
    const [exiting, setExiting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleExitAll = async () => {
        setExiting(true);
        try {
            const response = await zerodhaAPI.exitAllPositions();
            const data = response.data;

            if (data.success) {
                showNotification(
                    `${data.message}. Closed: ${data.positions_closed}, Failed: ${data.positions_failed}`,
                    data.positions_failed > 0 ? 'error' : 'success'
                );
                onRefresh();
            }
        } catch (err) {
            showNotification(
                err.response?.data?.detail || 'Failed to exit positions',
                'error'
            );
        } finally {
            setExiting(false);
            setShowConfirm(false);
        }
    };

    // Get positions data
    const positions = accountInfo?.positions?.net || [];
    const openPositions = positions.filter(p => p.quantity !== 0 && p.product !== 'CNC');
    const hasOpenPositions = openPositions.length > 0;

    // Calculate totals
    const totalPnL = positions.reduce((sum, p) => sum + (p.pnl || 0), 0);
    const equity = accountInfo?.margins?.equity || {};
    const availableBalance = equity.available?.live_balance || equity.net || 0;

    if (!connection) {
        return (
            <Card className="glass border-0">
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Not Connected</h3>
                    <p className="text-muted-foreground">
                        Connect your Zerodha account to view your portfolio and enable auto-trading.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {/* Confirm Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <Card className="glass border-0 max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-400">
                                <AlertTriangle className="h-6 w-6" />
                                Confirm Exit All Positions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                This will place MARKET orders to close all your open intraday positions
                                ({openPositions.length} positions). CNC (delivery) positions will not be affected.
                            </p>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-sm text-red-400">
                                    <strong>Warning:</strong> This action cannot be undone. All positions will be
                                    closed at current market prices.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={exiting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex-1 gap-2"
                                    onClick={handleExitAll}
                                    disabled={exiting}
                                >
                                    {exiting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Exiting...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-4 w-4" />
                                            Exit All
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Account Info Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Balance Card */}
                <Card className="glass border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Wallet className="h-5 w-5" />
                                <span className="text-sm">Available Balance</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onRefresh} className="h-8 w-8">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-1">
                            <IndianRupee className="h-6 w-6 text-green-500" />
                            <span className="text-3xl font-bold">
                                {availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Connected as: {accountInfo?.profile?.user_id || connection.api_key?.slice(0, 8) + '...'}
                        </p>
                    </CardContent>
                </Card>

                {/* P&L Card */}
                <Card className="glass border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            {totalPnL >= 0 ? (
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-sm">Today's P&L</span>
                        </div>
                        <div className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {positions.length} total positions
                        </p>
                    </CardContent>
                </Card>

                {/* Exit All Card */}
                <Card className={`border-0 ${hasOpenPositions ? 'bg-red-500/10 border border-red-500/30' : 'glass'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            <XCircle className="h-5 w-5" />
                            <span className="text-sm">Open Positions</span>
                        </div>
                        <div className="text-3xl font-bold mb-3">
                            {openPositions.length} <span className="text-sm font-normal text-muted-foreground">active</span>
                        </div>
                        {hasOpenPositions ? (
                            <Button
                                variant="danger"
                                className="w-full gap-2"
                                onClick={() => setShowConfirm(true)}
                                disabled={exiting}
                            >
                                {exiting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Exiting...
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-4 w-4" />
                                        EXIT ALL POSITIONS
                                    </>
                                )}
                            </Button>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No open intraday positions
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default AccountInfo;
