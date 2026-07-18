import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    TrendingUp,
    Zap,
    Shield,
    Phone,
    MessageCircle,
    ArrowRight,
    BarChart3,
    Bell,
    Clock
} from 'lucide-react';

const PHONE_NUMBER = '+919876543210';
const WHATSAPP_PREMIUM = `https://wa.me/${PHONE_NUMBER}?text=Hi%2C%20I%20want%20to%20get%20a%20FREE%20TRIAL%20of%20your%20Premium%20Indicator.%20My%20TradingView%20ID%20is%3A%20`;
const WHATSAPP_CUSTOM = `https://wa.me/${PHONE_NUMBER}?text=Hi%2C%20I%20want%20to%20discuss%20a%20Custom%20Indicator%20Development%20project.`;

function Landing() {
    return (
        <div className="min-h-screen gradient-bg">
            {/* Header */}
            <header className="sticky top-0 z-50 glass">
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
                        <Link to="/login">
                            <Button variant="outline" size="sm">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="gradient" size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Zero Latency Trading Automation</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                            Automate Your Trading
                        </span>
                        <br />
                        <span className="text-foreground">With TradingView Signals</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Connect your Zerodha account with TradingView alerts. Execute trades automatically with zero latency, zero failures. Professional algo trading made simple.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button variant="gradient" size="xl" className="gap-2">
                                Start Trading Now
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <a href={WHATSAPP_PREMIUM} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="xl" className="gap-2">
                                <MessageCircle className="h-5 w-5 text-green-500" />
                                Get Free Trial
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                    Why Choose <span className="text-green-500">Trading View Automation</span>?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="glass border-0 group hover:scale-105 transition-transform duration-300">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow">
                                <Zap className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Zero Latency</h3>
                            <p className="text-muted-foreground">
                                Lightning-fast order execution. Your TradingView signals are processed and executed in milliseconds.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass border-0 group hover:scale-105 transition-transform duration-300">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-6">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Zero Failures</h3>
                            <p className="text-muted-foreground">
                                Robust infrastructure ensures your orders never fail. Real-time monitoring and instant notifications.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass border-0 group hover:scale-105 transition-transform duration-300">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-6">
                                <BarChart3 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Easy Setup</h3>
                            <p className="text-muted-foreground">
                                Connect your Zerodha account in minutes. No coding required. Just copy-paste your webhook URL.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* How It Works */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                    How It <span className="text-green-500">Works</span>
                </h2>
                <div className="grid md:grid-cols-4 gap-8">
                    {[
                        { icon: TrendingUp, title: "1. Sign Up", desc: "Create your free account" },
                        { icon: Shield, title: "2. Connect Zerodha", desc: "Link your broker account" },
                        { icon: Bell, title: "3. Get Webhook URL", desc: "Copy your unique URL" },
                        { icon: Clock, title: "4. Automate", desc: "Set up TradingView alerts" },
                    ].map((step, i) => (
                        <div key={i} className="text-center">
                            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4 relative">
                                <step.icon className="h-10 w-10 text-green-500" />
                                {i < 3 && (
                                    <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2">
                                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <Card className="glass border-0 overflow-hidden">
                    <CardContent className="p-12 text-center relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Ready to Start <span className="text-green-500">Automating</span>?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Join thousands of traders who trust our platform for their algo trading needs.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register">
                                    <Button variant="gradient" size="xl">Get Started Free</Button>
                                </Link>
                                <a href={`tel:${PHONE_NUMBER}`}>
                                    <Button variant="outline" size="xl" className="gap-2">
                                        <Phone className="h-5 w-5" />
                                        Call Now
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <footer className="glass mt-20">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                                <span className="font-bold text-lg">Trading View Automation</span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Professional algo trading platform for TradingView and Zerodha integration.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/login" className="hover:text-green-500 transition-colors">Login</Link></li>
                                <li><Link to="/register" className="hover:text-green-500 transition-colors">Register</Link></li>
                                <li><Link to="/donations" className="hover:text-green-500 transition-colors">Support Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Services</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href={WHATSAPP_PREMIUM} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">Premium Indicator Trial</a></li>
                                <li><a href={WHATSAPP_CUSTOM} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">Custom Indicators</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-2 hover:text-green-500 transition-colors">
                                        <Phone className="h-4 w-4" />
                                        {PHONE_NUMBER}
                                    </a>
                                </li>
                                <li>
                                    <a href={WHATSAPP_CUSTOM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-500 transition-colors">
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Trading View Automation. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
