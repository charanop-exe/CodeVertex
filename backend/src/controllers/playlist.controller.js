import { db } from "../libs/db.js";

export const getAllListDetails = async (req, res) => {
    const userId = req.user.id;

    try {
        const playlists = await db.playlist.findMany({
            where: { userId },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: "Playlists fetched successfully",
            data: playlists
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch playlists",
            error: error.message
        });
    }
}


export const getPlaylistDetails = async (req, res) => {
    const userId = req.user.id;
    const playlistId = req.params.playlistId;
    try {
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId: userId
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Playlist details fetched successfully",
            data: playlist
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch playlist details",
            error: error.message
        });
    }
}

export const createPlaylist = async (req, res) => {
    try {
            
        const userId = req.user.id;
        const { name, description } = req.body;
        const newPlaylist = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        });
        res.status(201).json({
            success: true,
            message: "Playlist created successfully",
            data: newPlaylist
        });
    }
    catch (error) {
        console.error("Error creating playlist:", error);
        return res.status(500).json({
            error: "Error in Creating Playlist"
        });
    }
}

// export const addProblemToPlaylist = async (req, res) => {
//     const userId = req.user.id;
//     const playlistId = req.params.playlistId;
//     const { problemIds } = req.body;
//     try {
//         // Check if the playlist belongs to the user
//         if (!Array.isArray(problemIds) || problemIds.length === 0) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid request or No problems provided"
//         });
//     }

//     const playlist = await db.playlist.findFirst({
//             where: {
//                 id: playlistId,
//                 userId: userId
//             }
//         });
//         if (!playlist) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Playlist not found"
//             });
//     }

//     const problemInPlaylist = await db.problemInPlaylist.createMany({
//         data: problemIds.map(problemId => ({
//             playlistId: playlistId,
//             problemId: problemId
//         })),
//         skipDuplicates: true
//     })
//         res.status(200).json({
//             success: true,
//             message: "Problems added to playlist successfully",
//             data: problemInPlaylist
//         });

    
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to add problem to playlist",
//             error: error.message
//         });
//     }
// }

export const addProblemToPlaylist = async (req, res) => {
    const userId = req.user.id;
    const playlistId = req.params.playlistId;
    const { problemIds } = req.body; // e.g., ["id1", "id2"]

    try {
        // ... (your existing validation for problemIds array) ...
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid request or No problems provided"
            });
        }

        // ... (your existing check for the playlist is good) ...
        const playlist = await db.playlist.findFirst({
            where: { id: playlistId, userId: userId }
        });
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found"
            });
        }

        // ✅ ADD THIS VALIDATION BLOCK
        // Check if all the problems actually exist
        const existingProblemsCount = await db.problem.count({
            where: {
                id: { in: problemIds }
            }
        });

        // If the number of found problems doesn't match the number of IDs sent...
        if (existingProblemsCount !== problemIds.length) {
            return res.status(404).json({
                success: false,
                message: "One or more problems were not found and could not be added."
            });
        }
        
        // Now it's safe to create the entries
        const problemInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map(problemId => ({
                playlistId: playlistId,
                problemId: problemId
            })),
            skipDuplicates: true
        });

        res.status(200).json({
            success: true,
            message: "Problems added to playlist successfully",
            data: problemInPlaylist
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add problem to playlist",
            error: error.message
        });
    }
}
export const deletePlaylist = async (req, res) => {
    const userId = req.user.id;
    const playlistId = req.params.playlistId;
    try {
        const playlist = await db.playlist.findFirst({
            where: {
                id: playlistId,
                userId: userId
            }
        });
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found"
            });
        }
        await db.playlist.delete({
            where: { id: playlistId }
        });
        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete playlist",   
            error: error.message
        });
    }
}

export const removeProblemInPlaylist = async (req, res) => {
    const userId = req.user.id;
    const playlistId = req.params.playlistId;
    const problemId = req.params.problemId;
    try {
        const playlist = await db.playlist.findFirst({
            where: {
                id: playlistId,
                userId: userId
            }
        });
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found"
            });
        }
        await db.problemInPlaylist.delete({
            where: {
                playlistId_problemId: {
                    playlistId: playlistId,
                    problemId: problemId
                }
        }});
    
        res.status(200).json({
            success: true,
            message: "Problem removed from playlist successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to remove problem from playlist",
            error: error.message
        });
    }
}

