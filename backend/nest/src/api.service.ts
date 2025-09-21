import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ApiService {
    private readonly baseUrl = 'https://jsonplaceholder.typicode.com';
    private readonly githubUrl = 'https://api.github.com';

    private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
        try {
            const response = await fetch(url, {
                headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new HttpException(
                    `API request failed: ${response.statusText}`,
                    response.status,
                );
            }

            return await response.json();
        } catch (error) {
            console.error(`Error making request to ${url}:`, error);
            throw new HttpException(
                'External API request failed',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async fetchPosts() {
        console.log('Fetching posts from JSONPlaceholder...');
        const posts = await this.makeRequest(`${this.baseUrl}/posts`);
        console.log(`Fetched ${posts.length} posts`);
        return posts.slice(0, 10);
    }

    async fetchPost(id: number) {
        console.log(`Fetching post ${id}...`);
        const post = await this.makeRequest(`${this.baseUrl}/posts/${id}`);

        const comments = await this.makeRequest(`${this.baseUrl}/posts/${id}/comments`);

        return {
        ...post,
        comments: comments.slice(0, 3),
        commentsCount: comments.length,
        };
    }

    async fetchUserComboData(userId: number) {
    console.log(`Fetching combo data for user ${userId}...`);

    try {
        const [user, posts, todos] = await Promise.all([
            this.makeRequest(`${this.baseUrl}/users/${userId}`),
            this.makeRequest(`${this.baseUrl}/users/${userId}/posts`),
            this.makeRequest(`${this.baseUrl}/users/${userId}/todos`),
        ]);

        const completedTodos = todos.filter((todo: any) => todo.completed).length;
        return {
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            website: user.website,
            company: user.company.name,
            },
            stats: {
            totalPosts: posts.length,
            totalTodos: todos.length,
            completedTodos,
            completionRate: `${Math.round((completedTodos / todos.length) * 100)}%`,
            },
            recentPosts: posts.slice(0, 3),
            recentTodos: todos.slice(0, 5),
        };
        } catch (error) {
        throw new HttpException(
            `Failed to fetch combo data for user ${userId}`,
            HttpStatus.SERVICE_UNAVAILABLE,
        );
        }
    }

    async fetchGithubUser(username: string) {
        console.log(`Fetching GitHub user: ${username}...`);
        try {
        const [user, repos] = await Promise.all([
            this.makeRequest(`${this.githubUrl}/users/${username}`),
            this.makeRequest(`${this.githubUrl}/users/${username}/repos?sort=updated&per_page=5`),
        ]);

        return {
            user: {
            login: user.login,
            name: user.name,
            bio: user.bio,
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,
            createdAt: user.created_at,
            avatarUrl: user.avatar_url,
            },
            topRepos: repos.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: repo.updated_at,
            })),
        };
        } catch (error) {
        throw new HttpException(
            `GitHub user ${username} not found or API error`,
            HttpStatus.NOT_FOUND,
        );
        }
    }

    async fetchWithRetry(url: string, maxRetries: number = 3): Promise<any> {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries} for ${url}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' }
            });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.log(`Attempt ${attempt} failed.`);
            if (attempt === maxRetries) {
            throw new HttpException(
                `Failed after ${maxRetries} attempts`,
                HttpStatus.SERVICE_UNAVAILABLE,
            );
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
        }
    }
    }