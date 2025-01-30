import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type Props = {
  settings: any;
  onSettingsChange: (settings: any) => void;
};

export const GeneralSettings = ({ settings, onSettingsChange }: Props) => {
  if (!settings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Shop Settings</CardTitle>
        <CardDescription>Configure your shop's basic settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="default_currency">Default Currency</Label>
          <Select 
            value={settings.default_currency}
            onValueChange={(value: Database['public']['Enums']['supported_currency']) => 
              onSettingsChange({ ...settings, default_currency: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="UAH">UAH (₴)</SelectItem>
              <SelectItem value="CAD">CAD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enable_guest_checkout"
            checked={settings.enable_guest_checkout}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, enable_guest_checkout: checked })
            }
          />
          <Label htmlFor="enable_guest_checkout">Enable Guest Checkout</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min_order_amount">Minimum Order Amount</Label>
          <Input
            id="min_order_amount"
            type="number"
            value={settings.min_order_amount || 0}
            onChange={(e) => 
              onSettingsChange({ ...settings, min_order_amount: Number(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_order_amount">Maximum Order Amount</Label>
          <Input
            id="max_order_amount"
            type="number"
            value={settings.max_order_amount || ''}
            onChange={(e) => 
              onSettingsChange({ ...settings, max_order_amount: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_rate">Tax Rate (%)</Label>
          <Input
            id="tax_rate"
            type="number"
            step="0.01"
            value={settings.tax_rate || 0}
            onChange={(e) => 
              onSettingsChange({ ...settings, tax_rate: Number(e.target.value) })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};