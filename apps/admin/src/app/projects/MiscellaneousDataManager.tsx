import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

interface Section {
  id: string;
  heading: string;
  keyValuePairs: KeyValuePair[];
}

interface MiscellaneousData {
  [heading: string]: {
    [key: string]: string;
  };
}

interface MiscellaneousDataManagerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MiscellaneousDataManager({ value, onChange, disabled = false }: MiscellaneousDataManagerProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const isInternalUpdate = useRef(false);

  // Parse JSON value on mount and when value changes (from parent)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    if (value) {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (parsed && typeof parsed === 'object') {
          // Convert object to sections array
          const sectionsArray: Section[] = Object.entries(parsed).map(([heading, data]: [string, any]) => {
            const keyValuePairs: KeyValuePair[] = Object.entries(data || {}).map(([key, val]: [string, any]) => ({
              id: generateId(),
              key,
              value: String(val),
            }));
            return {
              id: generateId(),
              heading,
              keyValuePairs,
            };
          });
          setSections(sectionsArray);
          // Expand all sections by default
          setExpandedSections(new Set(sectionsArray.map((s) => s.id)));
        } else {
          setSections([]);
        }
      } catch {
        setSections([]);
      }
    } else {
      setSections([]);
    }
  }, [value]);

  // Helper to update sections and notify parent
  const updateSections = (newSections: Section[]) => {
    isInternalUpdate.current = true;
    setSections(newSections);
    
    // Convert sections to JSON object
    const jsonObject: MiscellaneousData = {};
    newSections.forEach((section) => {
      if (section.heading.trim()) {
        const keyValueObj: { [key: string]: string } = {};
        section.keyValuePairs.forEach((kv) => {
          if (kv.key.trim()) {
            keyValueObj[kv.key] = kv.value;
          }
        });
        jsonObject[section.heading] = keyValueObj;
      }
    });
    
    const jsonString = JSON.stringify(jsonObject, null, 2);
    onChange(jsonString);
  };

  const generateId = () => {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addSection = () => {
    const newSection: Section = {
      id: generateId(),
      heading: '',
      keyValuePairs: [],
    };
    updateSections([...sections, newSection]);
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const removeSection = (sectionId: string) => {
    const newSections = sections.filter((s) => s.id !== sectionId);
    updateSections(newSections);
    const newExpanded = new Set(expandedSections);
    newExpanded.delete(sectionId);
    setExpandedSections(newExpanded);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    const newSections = sections.map((s) =>
      s.id === sectionId ? { ...s, ...updates } : s
    );
    updateSections(newSections);
  };

  const addKeyValuePair = (sectionId: string) => {
    const newPair: KeyValuePair = {
      id: generateId(),
      key: '',
      value: '',
    };
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      updateSection(sectionId, {
        keyValuePairs: [...section.keyValuePairs, newPair],
      });
    }
  };

  const removeKeyValuePair = (sectionId: string, pairId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      updateSection(sectionId, {
        keyValuePairs: section.keyValuePairs.filter((kv) => kv.id !== pairId),
      });
    }
  };

  const updateKeyValuePair = (sectionId: string, pairId: string, updates: Partial<KeyValuePair>) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      updateSection(sectionId, {
        keyValuePairs: section.keyValuePairs.map((kv) =>
          kv.id === pairId ? { ...kv, ...updates } : kv
        ),
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">Miscellaneous Data</Label>
        <Button
          type="button"
          onClick={addSection}
          disabled={disabled}
          size="sm"
          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border border-dashed border-white/10 rounded-md">
          <p>No sections added yet. Click "Add Section" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border border-white/10 rounded-lg bg-slate-800/30 overflow-hidden"
            >
              {/* Section Header */}
              <div className="p-4 bg-slate-800/50 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection(section.id)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      {expandedSections.has(section.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Input
                      value={section.heading}
                      onChange={(e) => updateSection(section.id, { heading: e.target.value })}
                      disabled={disabled}
                      placeholder="Section Heading"
                      className="bg-slate-700/50 border-white/10 text-white flex-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(section.id)}
                    disabled={disabled}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Key-Value Pairs */}
              {expandedSections.has(section.id) && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-400 text-sm">Key-Value Pairs</Label>
                    <Button
                      type="button"
                      onClick={() => addKeyValuePair(section.id)}
                      disabled={disabled}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Pair
                    </Button>
                  </div>

                  {section.keyValuePairs.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-white/5 rounded-md">
                      No key-value pairs added. Click "Add Pair" to add one.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {section.keyValuePairs.map((pair) => (
                        <div
                          key={pair.id}
                          className="p-3 bg-slate-900/50 border border-white/5 rounded-md"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-gray-400 mb-1">Key</Label>
                              <Input
                                value={pair.key}
                                onChange={(e) => updateKeyValuePair(section.id, pair.id, { key: e.target.value })}
                                disabled={disabled}
                                placeholder="Enter key"
                                className="bg-slate-800/50 border-white/10 text-white"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Label className="text-xs text-gray-400 mb-1">Value</Label>
                                <Input
                                  value={pair.value}
                                  onChange={(e) => updateKeyValuePair(section.id, pair.id, { value: e.target.value })}
                                  disabled={disabled}
                                  placeholder="Enter value"
                                  className="bg-slate-800/50 border-white/10 text-white"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeKeyValuePair(section.id, pair.id)}
                                disabled={disabled}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-6"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

