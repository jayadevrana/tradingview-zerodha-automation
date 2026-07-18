import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Code2,
    MessageCircle,
    CheckCircle2,
    FileText,
    Lightbulb,
    Settings,
    Users,
    Clock,
    Workflow,
    AlertCircle
} from 'lucide-react';

const PHONE_NUMBER = '+919876543210';
const WHATSAPP_CUSTOM = `https://wa.me/${PHONE_NUMBER}?text=Hi%2C%20I%20want%20to%20discuss%20a%20Custom%20Indicator%2FStrategy%20Development%20project.%20Here%20are%20my%20requirements%3A%0A%0A`;

function CustomIndicator() {
    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <Card className="glass border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
                <CardContent className="p-8 relative">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <Code2 className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-3">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    Custom Indicator Development
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                Have a unique trading strategy? We'll convert it into a professional TradingView indicator
                                with alerts that work seamlessly with our automation platform!
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">Pine Script</span>
                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">Custom Strategies</span>
                                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm">Auto-Trading Ready</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* What We Can Build */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Settings, title: 'Custom Indicators', desc: 'Any technical indicator you can imagine' },
                    { icon: Workflow, title: 'Trading Strategies', desc: 'Complete entry/exit logic with alerts' },
                    { icon: Users, title: 'Multi-Symbol Scanners', desc: 'Scan multiple stocks/instruments' },
                    { icon: Clock, title: 'Time-Based Alerts', desc: 'Session-specific trading rules' },
                ].map((item, i) => (
                    <Card key={i} className="glass border-0 group hover:scale-105 transition-transform duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                                <item.icon className="h-7 w-7 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Information Required */}
            <Card className="glass border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-blue-500" />
                        Information We Need From You
                    </CardTitle>
                    <CardDescription>
                        To build your custom indicator, please share the following details on WhatsApp
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Required Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-green-500 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                Required Information
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { title: 'Strategy Logic', desc: 'Detailed description of your trading rules (entry, exit, stop-loss)' },
                                    { title: 'Indicators Used', desc: 'List any existing indicators your strategy is based on (RSI, MACD, EMA, etc.)' },
                                    { title: 'Timeframe', desc: 'Which timeframes should the indicator work on?' },
                                    { title: 'Instruments', desc: 'Stocks, Futures, Options, MCX, or Crypto?' },
                                    { title: 'Alert Conditions', desc: 'When should alerts be triggered? (Candle close, crossover, etc.)' },
                                ].map((item, i) => (
                                    <li key={i} className="p-3 rounded-lg bg-muted/30">
                                        <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Optional but Helpful */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-blue-500 flex items-center gap-2">
                                <Lightbulb className="h-5 w-5" />
                                Optional but Helpful
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { title: 'Screenshots/Charts', desc: 'Visual examples of entry/exit points on charts' },
                                    { title: 'Existing Pine Script', desc: 'If you have any code you want us to improve/modify' },
                                    { title: 'Backtest Results', desc: 'Any historical data showing strategy performance' },
                                    { title: 'Reference Indicator', desc: 'Link to any similar indicator for reference' },
                                    { title: 'Customization Options', desc: 'Which parameters should be adjustable by user?' },
                                ].map((item, i) => (
                                    <li key={i} className="p-3 rounded-lg bg-muted/30">
                                        <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-yellow-500 mb-1">Please Note</h4>
                                <p className="text-sm text-muted-foreground">
                                    The more detailed information you provide, the faster and more accurate we can build your indicator.
                                    Complex indicators may require multiple iterations to perfect. Pricing depends on complexity -
                                    contact us for a quote!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Ready to Build Your Custom Indicator?
                        </h3>
                        <p className="text-center text-muted-foreground mb-6">
                            Click the button below to start a conversation. Share your requirements and we'll provide a quote within 24 hours!
                        </p>
                        <div className="flex justify-center">
                            <a href={WHATSAPP_CUSTOM} target="_blank" rel="noopener noreferrer">
                                <Button variant="gradient" size="xl" className="gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                    <MessageCircle className="h-6 w-6" />
                                    Discuss on WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Process */}
                    <div>
                        <h3 className="font-semibold mb-4">Our Development Process:</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { step: 1, title: 'Discussion', desc: 'Understand your requirements' },
                                { step: 2, title: 'Quote', desc: 'Provide pricing & timeline' },
                                { step: 3, title: 'Development', desc: 'Build & test your indicator' },
                                { step: 4, title: 'Delivery', desc: 'Deploy to your TradingView' },
                            ].map((item, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-white font-bold">{item.step}</span>
                                    </div>
                                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CustomIndicator;
