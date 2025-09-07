import React from 'react';
import { GlassCard } from '../GlassCard';
import { Shield, AlertTriangle, Phone, Info, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const emergencyContacts = [
  { name: 'Emergency Services', number: '911', type: 'emergency' },
  { name: 'FEMA', number: '1-800-621-3362', type: 'federal' },
  { name: 'Red Cross', number: '1-800-733-2767', type: 'relief' },
  { name: 'Poison Control', number: '1-800-222-1222', type: 'medical' },
];

const disasterTypes = [
  {
    type: 'Earthquake',
    icon: '🏠',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    guidelines: [
      'Drop, Cover, and Hold On immediately',
      'Stay away from windows and heavy objects',
      'If outdoors, move away from buildings and power lines',
      'After shaking stops, check for injuries and hazards',
      'Be prepared for aftershocks'
    ]
  },
  {
    type: 'Wildfire',
    icon: '🔥',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    guidelines: [
      'Evacuate immediately if told to do so',
      'Create defensible space around your home',
      'Close all windows and doors',
      'Remove flammable materials from around house',
      'Have evacuation route planned in advance'
    ]
  },
  {
    type: 'Flood',
    icon: '🌊',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    guidelines: [
      'Turn Around, Don\'t Drown - avoid flooded roads',
      'Move to higher ground immediately',
      'Avoid walking in moving water',
      'Stay away from downed power lines',
      'Listen to local authorities for evacuation orders'
    ]
  },
  {
    type: 'Hurricane',
    icon: '🌀',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    guidelines: [
      'Board up windows and secure outdoor items',
      'Stock up on emergency supplies',
      'Identify safe room in your home',
      'Avoid going outside during the eye of the storm',
      'Stay informed through weather radio'
    ]
  },
  {
    type: 'Tornado',
    icon: '🌪️',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    guidelines: [
      'Go to lowest floor and center of building',
      'Stay away from windows',
      'Get under sturdy furniture if possible',
      'Cover yourself with mattress or blankets',
      'If in car, get out and lie in low area'
    ]
  }
];

const preparednessChecklist = [
  'Emergency kit with 3 days of supplies',
  'Battery-powered or hand-crank radio',
  'First aid kit and medications',
  'Copies of important documents',
  'Cash in small bills',
  'Emergency contact information',
  'Local maps and evacuation routes',
  'Fire extinguisher and smoke detectors'
];

export const Guidelines = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Government Guidelines</h2>
        <p className="text-muted-foreground">
          Official disaster preparedness and response guidelines from federal and local authorities
        </p>
      </div>

      {/* Emergency Contacts */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="w-6 h-6 text-destructive" />
          <h3 className="text-xl font-semibold text-foreground">Emergency Contacts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="p-4 rounded-lg bg-accent/30 border border-glass-border">
              <h4 className="font-semibold text-foreground text-sm">{contact.name}</h4>
              <p className="text-lg font-bold text-destructive">{contact.number}</p>
              <p className="text-xs text-muted-foreground capitalize">{contact.type}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Disaster-Specific Guidelines */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Disaster Response Guidelines</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {disasterTypes.map((disaster, index) => (
            <div key={index} className="p-5 rounded-lg bg-accent/20 border border-glass-border">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${disaster.bgColor} flex items-center justify-center`}>
                  <span className="text-xl">{disaster.icon}</span>
                </div>
                <h4 className={`text-lg font-semibold ${disaster.color}`}>{disaster.type}</h4>
              </div>
              <ul className="space-y-2">
                {disaster.guidelines.map((guideline, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Emergency Preparedness Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Emergency Preparedness</h3>
          </div>
          <div className="space-y-3">
            {preparednessChecklist.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary border-2 border-muted rounded focus:ring-primary" 
                />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Official Resources</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-accent/30 border border-glass-border">
              <h4 className="font-semibold text-foreground mb-2">Ready.gov</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Official U.S. government site for emergency preparedness
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Ready.gov
              </Button>
            </div>
            
            <div className="p-4 rounded-lg bg-accent/30 border border-glass-border">
              <h4 className="font-semibold text-foreground mb-2">FEMA App</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get real-time alerts and safety tips
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Download App
              </Button>
            </div>
            
            <div className="p-4 rounded-lg bg-accent/30 border border-glass-border">
              <h4 className="font-semibold text-foreground mb-2">Local Emergency Management</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Find your local emergency management office
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Find Local Office
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Additional Information */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-warning" />
          <h3 className="text-xl font-semibold text-foreground">Important Reminders</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <h4 className="font-semibold text-warning mb-2">Stay Informed</h4>
            <p className="text-sm text-muted-foreground">
              Monitor local news and weather alerts regularly
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Have a Plan</h4>
            <p className="text-sm text-muted-foreground">
              Create and practice emergency plans with your family
            </p>
          </div>
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <h4 className="font-semibold text-destructive mb-2">Build a Kit</h4>
            <p className="text-sm text-muted-foreground">
              Maintain emergency supplies for at least 72 hours
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};