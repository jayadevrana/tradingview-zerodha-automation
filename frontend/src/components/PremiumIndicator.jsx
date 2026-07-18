import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Sparkles,
    MessageCircle,
    CheckCircle2,
    TrendingUp,
    Target,
    Bell,
    Shield,
    Zap,
    Star,
    Gift
} from 'lucide-react';

const PHONE_NUMBER = '+919876543210';
const WHATSAPP_PREMIUM = `https://wa.me/${PHONE_NUMBER}?text=Hi%2C%20I%20want%20to%20get%20a%20FREE%20TRIAL%20of%20your%20Premium%20Indicator.%20My%20TradingView%20ID%20is%3A%20`;

function PremiumIndicator() {
    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <Card className="glass border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10" />
                <CardContent className="p-8 relative">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center animate-pulse-glow">
                                <Sparkles className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-3">
                                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                                    Premium Trading Indicator
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                Get exclusive access to our high-accuracy trading indicator that has helped thousands of traders improve their win rate!
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                                <Gift className="h-5 w-5 text-green-500" />
                                <span className="text-green-400 font-semibold">FREE TRIAL Available!</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { icon: Target, title: 'High Accuracy', desc: 'Proven signals with 75%+ accuracy rate' },
                    { icon: Bell, title: 'Real-Time Alerts', desc: 'Instant notifications on TradingView' },
                    { icon: Zap, title: 'Auto-Execution', desc: 'Works seamlessly with our platform' },
                    { icon: Shield, title: 'Risk Management', desc: 'Built-in stop-loss recommendations' },
                    { icon: TrendingUp, title: 'Multi-Timeframe', desc: 'Works on all timeframes & instruments' },
                    { icon: Star, title: 'Premium Support', desc: '24/7 WhatsApp support included' },
                ].map((feature, i) => (
                    <Card key={i} className="glass border-0 group hover:scale-105 transition-transform duration-300">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                                <feature.icon className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* How to Get Access */}
            <Card className="glass border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="h-6 w-6 text-green-500" />
                        How to Get Your FREE Trial
                    </CardTitle>
                    <CardDescription>
                        Follow these simple steps to start using our premium indicator
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { step: 1, title: 'Open TradingView', desc: 'Log in to your TradingView account' },
                            { step: 2, title: 'Find Your ID', desc: 'Go to Profile → Copy your username' },
                            { step: 3, title: 'Share on WhatsApp', desc: 'Send us your TradingView ID' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">{item.step}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Ready to Start Your Free Trial?
                        </h3>
                        <p className="text-center text-muted-foreground mb-6">
                            Click the button below and send us your TradingView ID. We'll add you to the indicator within 24 hours!
                        </p>
                        <div className="flex justify-center">
                            <a href={WHATSAPP_PREMIUM} target="_blank" rel="noopener noreferrer">
                                <Button variant="success" size="xl" className="gap-3">
                                    <MessageCircle className="h-6 w-6" />
                                    Get Free Trial on WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* What You'll Get */}
                    <div>
                        <h3 className="font-semibold mb-4">What's Included in the Trial:</h3>
                        <ul className="grid md:grid-cols-2 gap-3">
                            {[
                                '7-day full access to premium indicator',
                                'All buy/sell signals with alerts',
                                'Stop-loss & target recommendations',
                                'Works on Equity, F&O, MCX, Crypto',
                                'Multi-timeframe analysis',
                                'Priority WhatsApp support',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default PremiumIndicator;
