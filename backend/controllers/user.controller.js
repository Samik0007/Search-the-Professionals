import User from '../models/user.model.js';

export async function getUserList(req, res) {
    try {
        // Always return sample data with proper names and roles
        const users = [
            {
                _id: '1',
                username: 'Satish',
                role: 'Developer',
                company: 'Skill'
            },
            {
                _id: '2',
                username: 'Sabin',
                role: 'Designer',
                company: 'Kavya'
            },
            {
                _id: '3',
                username: 'Regan',
                role: 'Marketer',
                company: 'Islington'
            },
            {
                _id: '4',
                username: 'Subham',
                role: 'Developer',
                company: 'TechCorp'
            },
            {
                _id: '5',
                username: 'Nabin',
                role: 'Designer',
                company: 'DesignStudio'
            },
            {
                _id: '6',
                username: 'Dinesh',
                role: 'Photographer',
                company: 'CreativeLens'
            },
            {
                _id: '7',
                username: 'Aasika',
                role: 'Consultant',
                company: 'BusinessPro'
            },
            {
                _id: '8',
                username: 'Cristiano',
                role: 'Marketer',
                company: 'MarketingPro'
            },
            {
                _id: '9',
                username: 'Vini',
                role: 'Developer',
                company: 'CodeCraft'
            },
            {
                _id: '10',
                username: 'Mbappe',
                role: 'Designer',
                company: 'ArtStudio'
            },
            {
                _id: '11',
                username: 'Bellingham',
                role: 'Photographer',
                company: 'PhotoPro'
            },
            {
                _id: '12',
                username: 'Devas',
                role: 'Consultant',
                company: 'StrategyCorp'
            }
        ];
        
        res.status(200).json({ users });
    } catch (e) {
        res.status(500).json({ message: 'Error fetching users', error: e });
    }
} 
