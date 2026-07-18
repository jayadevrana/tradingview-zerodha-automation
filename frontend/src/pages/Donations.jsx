import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Heart,
    TrendingUp,
    Copy,
    CheckCircle,
    Wallet,
    Coffee,
    Star,
    Sparkles
} from 'lucide-react';

const UPI_ID = 'yourname@upi';
const PHONE_NUMBER = '+919876543210';

function Donations() {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(UPI_ID);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="min-h-screen gradient-bg">
            {/* Header */}
            <header className="sticky top-0 z-50 glass">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Trading View Automation
                        </span>
                    </Link>
                    <Link to="/dashboard">
                        <Button variant="outline" size="sm">Back to Dashboard</Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                            <Heart className="h-12 w-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                                Support Our Work
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Your donations help us keep the platform running and develop new features!
                        </p>
                    </div>

                    {/* Donation Card */}
                    <Card className="glass border-0 mb-8">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Wallet className="h-6 w-6 text-green-500" />
                                Donate via UPI
                            </CardTitle>
                            <CardDescription>
                                Scan the QR code or use the UPI ID below
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* QR Code Placeholder */}
                            <div className="bg-white rounded-xl p-8 max-w-xs mx-auto">
                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <Wallet className="h-16 w-16 mx-auto mb-2" />
                                        <p className="text-sm">QR Code</p>
                                        <p className="text-xs text-gray-400">Add your UPI QR here</p>
                                    </div>
                                </div>
                            </div>

                            {/* UPI ID */}
                            <div className="flex items-center justify-center gap-2">
                                <div className="px-4 py-2 rounded-lg bg-muted font-mono">
                                    {UPI_ID}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            {/* Suggested Amounts */}
                            <div className="grid grid-cols-4 gap-3">
                                {[99, 199, 499, 999].map((amount) => (
                                    <Button
                                        key={amount}
                                        variant="outline"
                                        className="text-lg font-semibold hover:bg-green-500/10 hover:border-green-500"
                                    >
                                        ₹{amount}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Why Donate */}
                    <Card className="glass border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-yellow-500" />
                                Why Donate?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { icon: Coffee, title: 'Keep Us Running', desc: 'Server costs, API fees, and maintenance' },
                                    { icon: Star, title: 'New Features', desc: 'Help us build more tools for you' },
                                    { icon: Heart, title: 'Free for All', desc: 'Keep the platform accessible to everyone' },
                                    { icon: TrendingUp, title: 'Better Performance', desc: 'Upgrade infrastructure for faster execution' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Thank You */}
                    <div className="text-center mt-12">
                        <p className="text-muted-foreground">
                            Thank you for your support! Every contribution makes a difference. 💚
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Donations;
