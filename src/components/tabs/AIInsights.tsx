import React from 'react';
import { GlassCard } from '../GlassCard';
import { Brain, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react';

export const AIInsights = () => {
  const riskPredictions = [
    {
      id: 1,
      type: 'Wildfire Risk',
      location: 'Northern California',
      probability: 78,
      timeframe: '48 hours',
      trend: 'increasing',
      factors: ['Low humidity', 'High winds', 'Dry vegetation'],
      confidence: 'High'
    },
    {
      id: 2,
      type: 'Flood Risk',
      location: 'Gulf Coast Region',
      probability: 45,
      timeframe: '5 days',
      trend: 'stable',
      factors: ['Heavy rainfall forecast', 'Saturated soil', 'River levels'],
      confidence: 'Medium'
    },
    {
      id: 3,
      type: 'Severe Weather',
      location: 'Midwest Plains',
      probability: 62,
      timeframe: '72 hours',
      trend: 'decreasing',
      factors: ['Temperature differential', 'Wind shear', 'Atmospheric pressure'],
      confidence: 'High'
    },
  ];

  const aiRecommendations = [
    {
      id: 1,
      priority: 'High',
      action: 'Deploy additional fire monitoring sensors',
      location: 'San Francisco Bay Area',
      reason: 'AI models predict 80% wildfire risk increase',
      status: 'pending'
    },
    {
      id: 2,
      priority: 'Medium',
      action: 'Issue evacuation preparedness alert',
      location: 'Marin County',
      reason: 'Historical pattern analysis shows elevated risk',
      status: 'completed'
    },
    {
      id: 3,
      priority: 'Medium',
      action: 'Coordinate with local emergency services',
      location: 'Houston Metropolitan Area',
      reason: 'Flood risk models indicate potential flash flooding',
      status: 'in-progress'
    },
    {
      id: 4,
      priority: 'Low',
      action: 'Update emergency response protocols',
      location: 'Oklahoma City',
      reason: 'Weather pattern analysis suggests protocol review',
      status: 'pending'
    },
  ];

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-destructive';
    if (probability >= 40) return 'text-warning';
    return 'text-primary';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Low':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">AI Insights & Predictions</h2>
        <p className="text-muted-foreground">
          Machine learning powered risk assessment and predictive analytics
        </p>
      </div>

      {/* AI Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <GlassCard variant="ai" className="p-4 text-center">
          <div className="text-2xl mb-2">🧠</div>
          <p className="text-2xl font-bold text-primary-glow">94.2%</p>
          <p className="text-sm text-muted-foreground">Model Accuracy</p>
        </GlassCard>
        <GlassCard variant="ai" className="p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-2xl font-bold text-primary-glow">156K</p>
          <p className="text-sm text-muted-foreground">Data Points</p>
        </GlassCard>
        <GlassCard variant="ai" className="p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-2xl font-bold text-primary-glow">2.3s</p>
          <p className="text-sm text-muted-foreground">Prediction Time</p>
        </GlassCard>
        <GlassCard variant="ai" className="p-4 text-center">
          <div className="text-2xl mb-2">🎯</div>
          <p className="text-2xl font-bold text-primary-glow">12</p>
          <p className="text-sm text-muted-foreground">Active Models</p>
        </GlassCard>
      </div>

      {/* Risk Predictions */}
      <GlassCard variant="ai" className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-primary-glow" />
          <h3 className="text-xl font-semibold text-foreground">AI Risk Predictions</h3>
        </div>
        <div className="space-y-4">
          {riskPredictions.map((prediction) => (
            <div key={prediction.id} className="p-4 rounded-xl bg-card/50 border border-glass-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">{prediction.type}</h4>
                  <p className="text-muted-foreground">{prediction.location}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getProbabilityColor(prediction.probability)}`}>
                    {prediction.probability}%
                  </p>
                  <p className="text-sm text-muted-foreground">in {prediction.timeframe}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${
                    prediction.trend === 'increasing' ? 'text-destructive' :
                    prediction.trend === 'decreasing' ? 'text-primary' : 'text-warning'
                  }`} />
                  <span className="text-sm text-muted-foreground capitalize">{prediction.trend}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-glow" />
                  <span className="text-sm text-muted-foreground">{prediction.confidence} Confidence</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Key Risk Factors:</p>
                <div className="flex flex-wrap gap-2">
                  {prediction.factors.map((factor, index) => (
                    <span key={index} className="px-2 py-1 rounded-full text-xs bg-primary-glow/10 text-primary-glow">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* AI Recommendations */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">AI Recommended Actions</h3>
        <div className="space-y-3">
          {aiRecommendations.map((rec) => (
            <div key={rec.id} className="flex items-start gap-4 p-4 rounded-xl bg-card/30 hover:bg-card/50 transition-colors">
              <div className="mt-1">
                {getStatusIcon(rec.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">{rec.action}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{rec.location}</p>
                <p className="text-xs text-muted-foreground">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Model Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Wildfire Prediction</span>
                <span className="text-sm font-medium text-foreground">96.8%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '96.8%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Flood Forecasting</span>
                <span className="text-sm font-medium text-foreground">92.4%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '92.4%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Severe Weather</span>
                <span className="text-sm font-medium text-foreground">94.1%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '94.1%' }}></div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Predictions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Bay Area Wildfire</p>
                <p className="text-xs text-muted-foreground">Predicted 3 days ago</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                ✓ Accurate
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Houston Flooding</p>
                <p className="text-xs text-muted-foreground">Predicted 1 week ago</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                ✓ Accurate
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Oklahoma Tornado</p>
                <p className="text-xs text-muted-foreground">Predicted 2 weeks ago</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-warning/10 text-warning">
                ~ Partial
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};