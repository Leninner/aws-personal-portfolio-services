import { IProject } from '../manageProjects';

export const updateProject = async (projectBody: IProject) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            data: projectBody,
        }),
    };
};
