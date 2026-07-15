// ============================================
// NEWS DATA
// ============================================

const NEWS_DATA = [
    {
        id: 1,
        title: 'AI Breakthrough: New Model Beats Human Performance in Medical Diagnosis',
        category: 'technology',
        source: 'cnn',
        published: '2 hours ago',
        timestamp: Date.now() - 7200000,
        status: 'breaking',
        summary: 'Researchers have developed a new AI model that outperforms human doctors in diagnosing diseases from medical images.',
        author: 'Sarah Chen',
        url: '#'
    },
    {
        id: 2,
        title: 'Global Markets Rally as Inflation Shows Signs of Cooling',
        category: 'business',
        source: 'reuters',
        published: '4 hours ago',
        timestamp: Date.now() - 14400000,
        status: 'published',
        summary: 'Stock markets around the world surged today after new data suggested inflation may be peaking.',
        author: 'Mike Johnson',
        url: '#'
    },
    {
        id: 3,
        title: 'Champions League Final: Underdogs Stun Favorites in Dramatic Match',
        category: 'sports',
        source: 'bbc',
        published: '6 hours ago',
        timestamp: Date.now() - 21600000,
        status: 'published',
        summary: 'In one of the greatest upsets in Champions League history, the underdogs defeated the reigning champions.',
        author: 'Emma Wilson',
        url: '#'
    },
    {
        id: 4,
        title: 'New Study Reveals Breakthrough in Cancer Treatment Research',
        category: 'health',
        source: 'ap',
        published: '8 hours ago',
        timestamp: Date.now() - 28800000,
        status: 'breaking',
        summary: 'Scientists have discovered a new approach that could revolutionize cancer treatment and improve survival rates.',
        author: 'Alex Rivera',
        url: '#'
    },
    {
        id: 5,
        title: 'Hollywood Writers Reach Tentative Deal, Ending Historic Strike',
        category: 'entertainment',
        source: 'nytimes',
        published: '12 hours ago',
        timestamp: Date.now() - 43200000,
        status: 'published',
        summary: 'After months of negotiations, the Writers Guild has reached a tentative agreement with studios.',
        author: 'Lisa Park',
        url: '#'
    },
    {
        id: 6,
        title: 'SpaceX Successfully Launches New Satellite Constellation',
        category: 'technology',
        source: 'cnn',
        published: '1 day ago',
        timestamp: Date.now() - 86400000,
        status: 'published',
        summary: 'The latest SpaceX mission has deployed 60 new satellites into orbit for global internet coverage.',
        author: 'David Kim',
        url: '#'
    },
    {
        id: 7,
        title: 'Federal Reserve Signals Potential Rate Cut in Coming Months',
        category: 'business',
        source: 'reuters',
        published: '1 day ago',
        timestamp: Date.now() - 90000000,
        status: 'draft',
        summary: 'Federal Reserve officials have indicated that they are considering interest rate cuts later this year.',
        author: 'Maria Garcia',
        url: '#'
    },
    {
        id: 8,
        title: 'World Cup Qualifiers: Team Advances with Last-Minute Goal',
        category: 'sports',
        source: 'bbc',
        published: '2 days ago',
        timestamp: Date.now() - 172800000,
        status: 'archived',
        summary: 'A dramatic last-minute goal secured the team\'s spot in the World Cup finals.',
        author: 'James Wilson',
        url: '#'
    },
    {
        id: 9,
        title: 'New Album Release Breaks Streaming Records Worldwide',
        category: 'entertainment',
        source: 'guardian',
        published: '2 days ago',
        timestamp: Date.now() - 180000000,
        status: 'published',
        summary: 'The highly anticipated album has shattered streaming records across all major platforms.',
        author: 'Anna Martinez',
        url: '#'
    },
    {
        id: 10,
        title: 'Climate Summit: Nations Agree to New Emission Reduction Targets',
        category: 'politics',
        source: 'ap',
        published: '3 days ago',
        timestamp: Date.now() - 259200000,
        status: 'published',
        summary: 'World leaders have reached a historic agreement on reducing carbon emissions at the climate summit.',
        author: 'Tom Anderson',
        url: '#'
    },
    {
        id: 11,
        title: 'Quantum Computing Milestone: 100-Qubit Processor Achieved',
        category: 'science',
        source: 'cnn',
        published: '3 days ago',
        timestamp: Date.now() - 270000000,
        status: 'breaking',
        summary: 'Scientists have successfully built a 100-qubit quantum processor, a major step toward practical quantum computing.',
        author: 'Sarah Chen',
        url: '#'
    },
    {
        id: 12,
        title: 'Tech Giants Face New Antitrust Regulations in Europe',
        category: 'technology',
        source: 'reuters',
        published: '4 days ago',
        timestamp: Date.now() - 345600000,
        status: 'published',
        summary: 'European regulators have proposed new rules targeting the market dominance of major tech companies.',
        author: 'Mike Johnson',
        url: '#'
    },
    {
        id: 13,
        title: 'Mental Health Crisis: New Study Shows Alarming Trends Among Youth',
        category: 'health',
        source: 'nytimes',
        published: '5 days ago',
        timestamp: Date.now() - 432000000,
        status: 'archived',
        summary: 'A comprehensive study reveals a significant increase in mental health issues among young people.',
        author: 'Emma Wilson',
        url: '#'
    },
    {
        id: 14,
        title: 'Stock Market Update: Tech Sector Leads Recovery',
        category: 'business',
        source: 'ap',
        published: '5 days ago',
        timestamp: Date.now() - 440000000,
        status: 'draft',
        summary: 'Technology stocks led a market recovery today as investor confidence began to return.',
        author: 'Alex Rivera',
        url: '#'
    },
    {
        id: 15,
        title: 'New Species Discovered in Deep Ocean Expedition',
        category: 'science',
        source: 'bbc',
        published: '6 days ago',
        timestamp: Date.now() - 518400000,
        status: 'published',
        summary: 'A deep-sea expedition has discovered several new species in the unexplored depths of the ocean.',
        author: 'Lisa Park',
        url: '#'
    }
];

const STATS_DATA = {
    articles: 12847,
    alerts: 8432,
    breaking: 143,
    sources: 27
};

const CATEGORY_ICONS = {
    technology: 'fa-microchip',
    business: 'fa-chart-line',
    sports: 'fa-futbol',
    entertainment: 'fa-film',
    health: 'fa-heartbeat',
    politics: 'fa-landmark',
    science: 'fa-flask'
};

const CATEGORY_COLORS = {
    technology: 'var(--primary-600)',
    business: 'var(--success)',
    sports: 'var(--warning)',
    entertainment: 'var(--danger)',
    health: 'var(--info)',
    politics: 'var(--gray-600)',
    science: 'var(--primary-400)'
};

const SOURCE_NAMES = {
    cnn: 'CNN',
    bbc: 'BBC',
    reuters: 'Reuters',
    ap: 'Associated Press',
    nytimes: 'NY Times',
    guardian: 'The Guardian'
};

const SOURCE_COLORS = {
    cnn: '#CC0000',
    bbc: '#B80000',
    reuters: '#FF8000',
    ap: '#333333',
    nytimes: '#D4A017',
    guardian: '#052962'
};
