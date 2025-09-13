# Food Waste Reduction Platform - Design Guidelines

## Design Approach
**Selected Approach**: Reference-Based Design inspired by social impact platforms like DonorsChoose and charitable marketplace interfaces, emphasizing trust, simplicity, and social good. The design prioritizes utility and clarity over visual complexity to ensure accessibility for diverse user groups including hotel staff and NGO volunteers.

## Core Design Elements

### Color Palette
**Primary Colors (Dark Mode)**: 
- Background: 215 25% 8% (dark slate)
- Surface: 215 20% 12% (elevated surfaces)
- Primary: 142 45% 55% (sustainable green)
- Text: 0 0% 95% (near white)

**Primary Colors (Light Mode)**:
- Background: 0 0% 98% (warm white)
- Surface: 0 0% 100% (pure white)
- Primary: 142 55% 45% (deeper green)
- Text: 215 15% 15% (dark gray)

**Accent Colors**: 
- Warning/Urgent: 25 85% 55% (amber for time-sensitive listings)
- Success: 142 65% 45% (confirmation states)

### Typography
- **Primary Font**: Inter (Google Fonts) - excellent readability for forms and data
- **Headings**: 600-700 weight, larger scale for section headers
- **Body**: 400-500 weight, optimized for reading food descriptions
- **Labels**: 500 weight, clear form field identification

### Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- p-4 for card padding
- m-6 for section spacing  
- gap-4 for grid layouts
- h-8 for input heights

### Component Library

**Navigation**: 
- Simple top navigation with user type indicator (Provider/NGO)
- Breadcrumb navigation for multi-step forms
- Mobile-first responsive hamburger menu

**Cards**:
- Food listing cards with location, quantity, and urgency indicators
- User profile cards for provider/NGO verification
- Chat message bubbles with timestamp and read status

**Forms**:
- Multi-step food registration form with progress indicator
- User registration with role selection (Provider/NGO)
- Search and filter forms for NGO food discovery

**Data Display**:
- List view for food waste listings with sort/filter options
- Map integration placeholder for location-based discovery
- Dashboard metrics for registered food quantities

**Interactive Elements**:
- Chat interface with message history
- Real-time availability toggles
- Contact/claim buttons with loading states

## Key Design Principles

1. **Trust & Transparency**: Clear provider verification badges, transparent food details
2. **Accessibility First**: High contrast ratios, clear labels, simple navigation
3. **Mobile Responsive**: Touch-friendly buttons, readable text on small screens
4. **Minimal Cognitive Load**: Single-purpose pages, clear call-to-actions
5. **Social Impact Focus**: Emphasize environmental benefit and community connection

## Images
- **Hero Image**: Medium-sized banner (not full viewport) showing diverse people sharing food, positioned on homepage
- **Food Listing Photos**: Small thumbnails for each food waste listing
- **Verification Badges**: Simple icon graphics for verified providers and NGOs
- **Empty States**: Friendly illustrations for no listings found or empty chat

## Animations
Minimal use only for:
- Loading states on form submissions
- Smooth transitions between chat messages
- Subtle hover effects on interactive cards

This design emphasizes functionality and social impact over visual complexity, ensuring the platform serves its humanitarian purpose effectively while maintaining professional credibility.