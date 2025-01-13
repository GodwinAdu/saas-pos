'use client'
import { useState, useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from 'lucide-react'

interface VersionChange {
    type: 'added' | 'changed' | 'fixed' | 'removed';
    description: string;
}

interface Version {
    number: string;
    date: string;
    changes: VersionChange[];
}

const versions: Version[] = [
    {
        number: "1.3.0",
        date: "2025-03-15",
        changes: [
            { type: 'added', description: "AI-powered content recommendations" },
            { type: 'changed', description: "Redesigned user interface for improved accessibility" },
            { type: 'fixed', description: "Memory leak in real-time collaboration feature" },
            { type: 'added', description: "Integration with popular third-party productivity tools" }
        ]
    },
    {
        number: "1.2.0",
        date: "2025-01-10",
        changes: [
            { type: 'added', description: "Dark mode support for better user experience in low-light environments" },
            { type: 'changed', description: "Improved performance on mobile devices, resulting in 30% faster load times" },
            { type: 'fixed', description: "Bug in user profile update that caused occasional data loss" },
            { type: 'added', description: "New analytics dashboard for detailed insights" }
        ]
    },
    {
        number: "1.1.0",
        date: "2024-12-15",
        changes: [
            { type: 'added', description: "New dashboard layout with customizable widgets" },
            { type: 'added', description: "Export functionality for reports in CSV and PDF formats" },
            { type: 'changed', description: "Updated dependencies for improved security and performance" },
            { type: 'fixed', description: "Minor UI inconsistencies in the settings page" }
        ]
    },
    {
        number: "1.0.0",
        date: "2024-11-01",
        changes: [
            { type: 'added', description: "Initial release of the application" },
            { type: 'added', description: "User authentication and authorization system" },
            { type: 'added', description: "Core features including user profiles, basic reporting, and data visualization" }
        ]
    }
];

const getBadgeColor = (type: VersionChange['type']) => {
    switch (type) {
        case 'added': return 'bg-green-500';
        case 'changed': return 'bg-blue-500';
        case 'fixed': return 'bg-yellow-500';
        case 'removed': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
};

export default function VersionPage() {
    const [expandedVersion, setExpandedVersion] = useState<string | null>(versions[0].number);
    const [filterType, setFilterType] = useState<VersionChange['type'] | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVersions = useMemo(() => {
        return versions.map(version => ({
            ...version,
            changes: version.changes.filter(change =>
                (filterType === 'all' || change.type === filterType) &&
                change.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(version => version.changes.length > 0);
    }, [filterType, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Version History</h1>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <Select onValueChange={(value: VersionChange['type'] | 'all') => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All changes</SelectItem>
                        <SelectItem value="added">Added</SelectItem>
                        <SelectItem value="changed">Changed</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="removed">Removed</SelectItem>
                    </SelectContent>
                </Select>
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        placeholder="Search changes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <Accordion type="single" collapsible value={expandedVersion as string} onValueChange={setExpandedVersion}>
                    {filteredVersions.map((version) => (
                        <AccordionItem key={version.number} value={version.number}>
                            <AccordionTrigger className="text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center w-full">
                                    <span className="text-2xl font-semibold">Version {version.number}</span>
                                    <div className="flex items-center sm:ml-4 mt-2 sm:mt-0">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="text-sm text-gray-500">{version.date}</span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="mt-4 space-y-4">
                                    {version.changes.map((change, index) => (
                                        <div key={index} className="flex items-start p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                            <Badge className={`${getBadgeColor(change.type)} text-white mr-2 mt-1`}>
                                                {change.type}
                                            </Badge>
                                            <p className="flex-grow">{change.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>

            {filteredVersions.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No changes found matching your criteria.
                </div>
            )}

            <div className="mt-8 text-center">
                <Button onClick={() => window.open('https://github.com/yourusername/yourrepo/releases', '_blank')}>
                    View Full Changelog on GitHub
                </Button>
            </div>
        </div>
    )
}

