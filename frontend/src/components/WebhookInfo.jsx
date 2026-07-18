import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Webhook,
    Copy,
    CheckCircle,
    Code,
    AlertTriangle
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

function WebhookInfo({ user, isConnected, showNotification }) {
    const [copiedField, setCopiedField] = useState(null);

    const webhookUrl = user ? `${API_URL}/api/webhook/${user.id}` : '';

    const handleCopy = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            showNotification('Copied to clipboard!', 'success');
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            showNotification('Failed to copy', 'error');
        }
    };

    const syntaxExamples = {
        equity: {
            title: 'Equity (Cash) Orders',
            examples: [
                { label: 'Buy', code: '{"E":"NSE","TS":"RELIANCE","TT":"BUY","Q":"10","OT":"MARKET","PT":"CNC"}' },
                { label: 'Sell', code: '{"E":"NSE","TS":"RELIANCE","TT":"SELL","Q":"10","OT":"MARKET","PT":"CNC"}' },
            ]
        },
        futures: {
            title: 'Futures (F&O) Orders',
            examples: [
                { label: 'Buy Nifty Futures', code: '{"E":"NFO","TS":"NIFTY25FEBFUT","TT":"BUY","Q":"50","OT":"MARKET","PT":"MIS"}' },
                { label: 'Sell Bank Nifty', code: '{"E":"NFO","TS":"BANKNIFTY25FEBFUT","TT":"SELL","Q":"15","OT":"MARKET","PT":"MIS"}' },
            ]
        },
        options: {
            title: 'Options Orders',
            examples: [
                { label: 'Buy Call Option', code: '{"E":"NFO","TS":"NIFTY2520623600CE","TT":"BUY","Q":"50","OT":"MARKET","PT":"MIS"}' },
                { label: 'Buy Put Option', code: '{"E":"NFO","TS":"NIFTY2520623400PE","TT":"BUY","Q":"50","OT":"MARKET","PT":"MIS"}' },
            ]
        },
        mcx: {
            title: 'MCX (Commodity) Orders',
            examples: [
                { label: 'Buy Gold', code: '{"E":"MCX","TS":"GOLDM25FEBFUT","TT":"BUY","Q":"1","OT":"MARKET","PT":"MIS"}' },
                { label: 'Buy Crude Oil', code: '{"E":"MCX","TS":"CRUDEOIL25FEBFUT","TT":"BUY","Q":"1","OT":"MARKET","PT":"MIS"}' },
            ]
        },
    };

    const syntaxReference = [
        { key: 'E', desc: 'Exchange', values: 'NSE, BSE, NFO, MCX, CDS' },
        { key: 'TS', desc: 'Trading Symbol', values: 'e.g., RELIANCE, NIFTY25FEBFUT' },
        { key: 'TT', desc: 'Transaction Type', values: 'BUY, SELL' },
        { key: 'Q', desc: 'Quantity', values: 'Number of shares/lots' },
        { key: 'OT', desc: 'Order Type', values: 'MARKET, LIMIT, SL, SL-M' },
        { key: 'PT', desc: 'Product Type', values: 'CNC (Delivery), MIS (Intraday), NRML' },
        { key: 'P', desc: 'Price (optional)', values: 'Required for LIMIT orders' },
        { key: 'TP', desc: 'Trigger Price (optional)', values: 'Required for SL orders' },
        { key: 'VL', desc: 'Validity (optional)', values: 'DAY, IOC' },
    ];

    if (!isConnected) {
        return (
            <Card className="glass border-0">
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Connect Zerodha First</h3>
                    <p className="text-muted-foreground">
                        Please connect your Zerodha account to get your webhook URL.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Webhook URL */}
            <Card className="glass border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Webhook className="h-6 w-6 text-green-500" />
                        Your Webhook URL
                    </CardTitle>
                    <CardDescription>
                        Use this URL in TradingView alerts to execute trades automatically
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 rounded-lg bg-muted/50 font-mono text-sm break-all">
                            {webhookUrl}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopy(webhookUrl, 'url')}
                            className="flex-shrink-0"
                        >
                            {copiedField === 'url' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <h4 className="font-medium text-green-400 mb-2">How to use in TradingView:</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Create a TradingView alert on your chart/indicator</li>
                            <li>In the "Notifications" tab, enable "Webhook URL"</li>
                            <li>Paste the webhook URL above</li>
                            <li>In the "Message" field, paste the order syntax (see examples below)</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            {/* Syntax Reference */}
            <Card className="glass border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-6 w-6 text-blue-500" />
                        Order Syntax Reference
                    </CardTitle>
                    <CardDescription>
                        Use these fields in your webhook message (JSON format)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 px-3 font-medium">Key</th>
                                    <th className="text-left py-2 px-3 font-medium">Description</th>
                                    <th className="text-left py-2 px-3 font-medium">Values</th>
                                </tr>
                            </thead>
                            <tbody>
                                {syntaxReference.map((item, i) => (
                                    <tr key={i} className="border-b border-border/50">
                                        <td className="py-2 px-3">
                                            <code className="px-2 py-0.5 rounded bg-muted text-green-400">{item.key}</code>
                                        </td>
                                        <td className="py-2 px-3 text-muted-foreground">{item.desc}</td>
                                        <td className="py-2 px-3 text-muted-foreground">{item.values}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Examples */}
            <Card className="glass border-0">
                <CardHeader>
                    <CardTitle>Order Examples</CardTitle>
                    <CardDescription>
                        Copy these examples and modify as needed for your trades
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Object.entries(syntaxExamples).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="font-semibold mb-3">{section.title}</h3>
                            <div className="space-y-2">
                                {section.examples.map((example, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm text-muted-foreground w-32 flex-shrink-0">{example.label}:</span>
                                        <code className="flex-1 text-xs font-mono text-green-400 break-all">
                                            {example.code}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopy(example.code, `${key}-${i}`)}
                                            className="flex-shrink-0 h-8 w-8"
                                        >
                                            {copiedField === `${key}-${i}` ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export default WebhookInfo;
