import React from 'react';
import MainLayout from '../../layout/MainLayout';

export default function Motto() {
    return (
        <MainLayout>
            <section className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-center text-white mb-12">Motto</h1>
                <div className="space-y-10 text-white leading-relaxed">

                    <p className="text-lg">
                        In today’s world, where everything is driven by data, a lot of important information stays hidden because it’s locked behind complicated systems and coding skills.
                    </p>

                    <p className="text-lg">
                        DataTalk aims to change that. It makes it easier for people and businesses to actually use their data without needing to know technical stuff.
                    </p>

                    <div>
                        <h2 className="text-3xl font-bold text-center text-white mb-4">My Mission</h2>
                        <p className="text-lg">
                            DataTalk’s goal is simple: to let anyone access, understand, and use data just by talking naturally. It turns everyday language into database searches,
                            helping more people find insights that drive growth, innovation, and smarter decisions.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-center text-white mb-4">Real-World Impact for Businesses</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-semibold text-white">From Questions to Strategic Advantage</h3>
                                <p className="text-lg">
                                    For example, if a manager asks, “Which products grew the most in the Southeast last year?”—DataTalk can answer it in seconds.
                                    No coding, no waiting for IT support. This quick access helps managers move from reacting to planning ahead.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-white">Making Data Accessible for Everyone</h3>
                                <p className="text-lg">
                                    Many companies invest millions in data systems, but only a few employees know how to use them.
                                    DataTalk unlocks these systems for everyone—not just tech experts.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-center text-whit mb-4">Real-World Impact for People</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-semibold text-white">Technical Freedom</h3>
                                <p className="text-lg">
                                    Imagine a marketing expert with great ideas but no tech skills. They can simply ask,
                                    “Which customers bought more than once last quarter but haven’t visited lately?” and get an answer—without writing a single line of code.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-white">More Time for Real Work</h3>
                                <p className="text-lg">
                                    DataTalk saves hours by letting people ask questions in plain language instead of spending time preparing data and writing complex queries.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-center text-white mb-4">Riding the AI Wave</h2>
                        <p className="text-lg">
                            I believe the AI boom isn't about making life easier for developers and technical people—it's about making tech accessible to everyone,
                            reducing barriers to entry, and making powerful tools available to all.
                            DataTalk is part of that change.
                        </p>
                    </div>

                    <p className="text-3xl text-center font-extrabold text-white mt-12">
                        DataTalk — Why should coders have all the fun?
                    </p>

                </div>
            </section>
        </MainLayout>

    );
};