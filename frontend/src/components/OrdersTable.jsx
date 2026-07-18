import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    ClipboardList,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

function OrdersTable({ orders }) {
    const getStatusBadge = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'complete' || statusLower === 'executed') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                    <CheckCircle className="h-3 w-3" />
                    Executed
                </span>
            );
        } else if (statusLower === 'rejected' || statusLower === 'cancelled') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                    <XCircle className="h-3 w-3" />
                    {status}
                </span>
            );
        } else if (statusLower === 'pending' || statusLower === 'open') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                    <Clock className="h-3 w-3" />
                    Pending
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                    <AlertCircle className="h-3 w-3" />
                    {status || 'Unknown'}
                </span>
            );
        }
    };

    const getTypeIcon = (type) => {
        const typeLower = type?.toLowerCase() || '';
        if (typeLower === 'buy') {
            return <TrendingUp className="h-4 w-4 text-green-500" />;
        } else if (typeLower === 'sell') {
            return <TrendingDown className="h-4 w-4 text-red-500" />;
        }
        return null;
    };

    if (!orders || orders.length === 0) {
        return (
            <Card className="glass border-0">
                <CardContent className="p-8 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground">
                        Your order history will appear here once you start trading via webhooks.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-blue-500" />
                    Order History
                </CardTitle>
                <CardDescription>
                    Recent orders placed via webhooks
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-3 font-medium">Time</th>
                                <th className="text-left py-3 px-3 font-medium">Symbol</th>
                                <th className="text-left py-3 px-3 font-medium">Type</th>
                                <th className="text-left py-3 px-3 font-medium">Qty</th>
                                <th className="text-left py-3 px-3 font-medium">Order Type</th>
                                <th className="text-left py-3 px-3 font-medium">Product</th>
                                <th className="text-left py-3 px-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <tr key={order.id || i} className="border-b border-border/50 hover:bg-muted/20">
                                    <td className="py-3 px-3 text-muted-foreground">
                                        {order.timestamp ? new Date(order.timestamp).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : '-'}
                                    </td>
                                    <td className="py-3 px-3">
                                        <div>
                                            <span className="font-medium">{order.symbol || '-'}</span>
                                            <span className="text-xs text-muted-foreground ml-2">{order.exchange || ''}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(order.type)}
                                            <span className={order.type?.toLowerCase() === 'buy' ? 'text-green-400' : 'text-red-400'}>
                                                {order.type || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">{order.quantity || '-'}</td>
                                    <td className="py-3 px-3 text-muted-foreground">{order.order_type || '-'}</td>
                                    <td className="py-3 px-3 text-muted-foreground">{order.product || '-'}</td>
                                    <td className="py-3 px-3">{getStatusBadge(order.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

export default OrdersTable;
