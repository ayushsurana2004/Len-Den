export class GroupController {
    groupRepository;
    userRepository;
    constructor(groupRepository, userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }
    createGroup = async (req, res) => {
        try {
            const { name } = req.body;
            const userId = req.user.id;
            const group = await this.groupRepository.create(name, userId);
            res.status(201).json(group);
        }
        catch (error) {
            res.status(500).json({ message: 'Error creating group', error: error.message });
        }
    };
    getUserGroups = async (req, res) => {
        try {
            const userId = req.user.id;
            const groups = await this.groupRepository.findByUserId(userId);
            res.json(groups);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching groups', error: error.message });
        }
    };
    getGroupMembers = async (req, res) => {
        try {
            const groupId = parseInt(req.params.groupId);
            if (isNaN(groupId)) {
                res.status(400).json({ message: 'Invalid groupId' });
                return;
            }
            const members = await this.groupRepository.getMembers(groupId);
            res.json(members);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching group members', error: error.message });
        }
    };
    addMember = async (req, res) => {
        try {
            const { mobileNumber } = req.body;
            const groupId = Number(req.body.groupId);
            const userId = req.body.userId ? Number(req.body.userId) : undefined;
            const inviterId = Number(req.user.id);
            // 1. Fetch group and inviter first (mandatory)
            const [group, inviter] = await Promise.all([
                this.groupRepository.findById(groupId),
                this.userRepository.findById(inviterId)
            ]);
            if (!group || !inviter) {
                res.status(404).json({ message: 'Group or Inviter not found' });
                return;
            }
            // 2. Scenario A: Adding an existing user
            if (userId) {
                const user = await this.userRepository.findById(userId);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                await this.groupRepository.addMember(groupId, userId);
                res.json({ message: 'Member added successfully' });
                return;
            }
            // 3. Scenario B: Inviting a non-existent user by mobile
            if (mobileNumber) {
                // Check if user actually exists first (in case client sent mobile instead of id)
                const existingUser = await this.userRepository.findByMobile(mobileNumber);
                if (existingUser) {
                    const uid = existingUser.getId();
                    if (uid) {
                        await this.groupRepository.addMember(groupId, uid);
                        res.json({ message: 'Member added successfully' });
                        return;
                    }
                }
                // If truly doesn't exist, create pending invitation
                await this.groupRepository.createPendingInvitation(groupId, mobileNumber, inviterId);
                res.json({ message: 'Invitation saved! User will be added when they register.' });
                return;
            }
            res.status(400).json({ message: 'Either userId or mobileNumber is required' });
        }
        catch (error) {
            res.status(500).json({ message: 'Error adding member', error: error.message });
        }
    };
}
//# sourceMappingURL=GroupController.js.map