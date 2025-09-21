import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  // Test return des données stat
  @Get('users')
  getUsers() {
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];
  }

  // Test avec paramètre
  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return {
      id: parseInt(id),
      name: `User ${id}`,
      email: `user${id}@example.com`
    };
  }

  // Test avec query parameters
  @Get('search')
  search(@Query('q') query: string, @Query('limit') limit: string = '10') {
    return {
      query,
      limit: parseInt(limit),
      results: [
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`
      ]
    };
  }

  // Test POST avec body
  @Post('users')
  createUser(@Body() userData: { name: string; email: string }) {
    return {
      id: Math.floor(Math.random() * 1000),
      ...userData,
      createdAt: new Date().toISOString()
    };
  }

  // test call api externe
  @Get('external/posts')
  async getExternalPosts() {
    return await this.apiService.fetchPosts();
  }

  @Get('external/posts/:id')
  async getExternalPost(@Param('id') id: string) {
    return await this.apiService.fetchPost(parseInt(id));
  }

  // test plusieurs api
  @Get('external/combo/:userId')
  async getComboData(@Param('userId') userId: string) {
    return await this.apiService.fetchUserComboData(parseInt(userId));
  }

  // test auth
  @Get('external/github/:username')
  async getGithubUser(@Param('username') username: string) {
    return await this.apiService.fetchGithubUser(username);
  }

  // test sur les performances
  @Get('stress-test')
  async stressTest() {
    const start = Date.now();
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(this.apiService.fetchPosts());
    }
    const results = await Promise.all(promises);
    const duration = Date.now() - start;
    return {
      message: 'Stress test completed',
      duration: `${duration}ms`,
      requestsMade: promises.length,
      totalPosts: results.reduce((acc, posts) => acc + posts.length, 0)
    };
  }
}